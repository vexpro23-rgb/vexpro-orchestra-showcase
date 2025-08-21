import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  plan_id: string;
  plan_name: string;
  amount: number;
  billing_type?: string;
}

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  mobilePhone?: string;
  cpfCnpj?: string;
}

interface AsaasPayment {
  id: string;
  object: string;
  dateCreated: string;
  customer: string;
  value: number;
  netValue: number;
  billingType: string;
  status: string;
  dueDate: string;
  invoiceUrl: string;
  bankSlipUrl?: string;
  qrCode?: {
    encodedImage: string;
    payload: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const user = userData.user;

    // Parse request body
    const { plan_id, plan_name, amount, billing_type = 'BOLETO' }: PaymentRequest = await req.json();

    if (!plan_id || !plan_name || !amount) {
      throw new Error("Missing required fields: plan_id, plan_name, amount");
    }

    // Get plan details
    const { data: planData, error: planError } = await supabaseService
      .from('plans')
      .select('*')
      .eq('id', plan_id)
      .single();

    if (planError || !planData) {
      throw new Error("Plan not found");
    }

    // Get user profile for additional data
    const { data: profileData } = await supabaseService
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single();

    const asaasApiKey = Deno.env.get("ASAAS_API_KEY");
    if (!asaasApiKey) {
      throw new Error("ASAAS API key not configured");
    }

    const asaasBaseUrl = "https://api.asaas.com/v3";
    
    // Create or get customer in Asaas
    let customerId: string;
    
    // Try to find existing customer by email
    const customerSearchResponse = await fetch(`${asaasBaseUrl}/customers?email=${user.email}`, {
      method: "GET",
      headers: {
        "access_token": asaasApiKey,
        "Content-Type": "application/json",
      },
    });

    const customerSearchData = await customerSearchResponse.json();
    
    if (customerSearchData.data && customerSearchData.data.length > 0) {
      customerId = customerSearchData.data[0].id;
    } else {
      // Create new customer
      const createCustomerResponse = await fetch(`${asaasBaseUrl}/customers`, {
        method: "POST",
        headers: {
          "access_token": asaasApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData?.full_name || user.email?.split('@')[0] || 'Cliente',
          email: user.email,
          externalReference: user.id,
        }),
      });

      const newCustomerData = await createCustomerResponse.json();
      
      if (!createCustomerResponse.ok) {
        console.error("Error creating customer:", newCustomerData);
        throw new Error(`Failed to create customer: ${newCustomerData.errors?.[0]?.description || 'Unknown error'}`);
      }

      customerId = newCustomerData.id;
    }

    // Calculate due date (7 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    
    // Create payment in Asaas
    const paymentData = {
      customer: customerId,
      billingType: billing_type,
      value: amount,
      dueDate: dueDate.toISOString().split('T')[0], // YYYY-MM-DD format
      description: `Assinatura ${planData.display_name} - Vexpro AI`,
      externalReference: user.id,
    };

    const createPaymentResponse = await fetch(`${asaasBaseUrl}/payments`, {
      method: "POST",
      headers: {
        "access_token": asaasApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const paymentResult = await createPaymentResponse.json();
    
    if (!createPaymentResponse.ok) {
      console.error("Error creating payment:", paymentResult);
      throw new Error(`Failed to create payment: ${paymentResult.errors?.[0]?.description || 'Unknown error'}`);
    }

    // Save order to database
    const orderData = {
      user_id: user.id,
      asaas_payment_id: paymentResult.id,
      plan_name: plan_name,
      amount: amount,
      currency: 'BRL',
      status: 'pending',
      billing_type: billing_type,
      due_date: dueDate.toISOString().split('T')[0],
      payment_url: paymentResult.invoiceUrl,
      invoice_url: paymentResult.invoiceUrl,
      bar_code: paymentResult.nossoNumero,
    };

    // Add PIX specific data if available
    if (billing_type === 'PIX' && paymentResult.qrCode) {
      orderData.qr_code = paymentResult.qrCode.encodedImage;
      orderData.pix_code = paymentResult.qrCode.payload;
    }

    // Add boleto URL if available
    if (billing_type === 'BOLETO' && paymentResult.bankSlipUrl) {
      orderData.payment_url = paymentResult.bankSlipUrl;
    }

    const { error: orderError } = await supabaseService
      .from('orders')
      .insert(orderData);

    if (orderError) {
      console.error("Error saving order:", orderError);
      throw new Error("Failed to save order to database");
    }

    // Return payment information
    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentResult.id,
        payment_url: orderData.payment_url,
        invoice_url: paymentResult.invoiceUrl,
        due_date: dueDate.toISOString().split('T')[0],
        amount: amount,
        billing_type: billing_type,
        status: 'pending',
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in create-payment:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Internal server error" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});