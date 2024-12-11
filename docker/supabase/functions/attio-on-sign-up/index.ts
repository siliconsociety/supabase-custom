import { Database } from '../auth-types.ts';

const baseUrl = 'https://api.attio.com/v2/objects';
const apiKey = Deno.env.get('ATTIO_API_KEY');
const objectId = Deno.env.get('ATTIO_OBJECT_ID');

const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
};

type AuthUserRecord = Database['auth']['Tables']['users']['Row'];

interface UserPayload {
  type: 'INSERT';
  table: string;
  record: AuthUserRecord;
  schema: 'auth';
  old_record: AuthUserRecord | null;
}

Deno.serve(async (req) => {
  try {
    const requestJson: UserPayload = await req.json();
    const endpoint: string = `${baseUrl}/${objectId}/records?matching_attribute=email_addresses`;
    const full_name: string = requestJson.record.raw_user_meta_data?.['full_name'] || '';

    const payload = {
      data: {
        values: {
          email_addresses: [
            {
              email_address: requestJson.record.email,
            },
          ],
          name: [
            {
              first_name: '',
              last_name: '',
              full_name: full_name,
            },
          ],
          agentops: [{ value: true }],
        },
      },
    };

    console.log(payload);
    return await fetch(endpoint, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(payload),
    });
  } catch (_error) {
    return new Response(_error);
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Run `supabase functions serve` 
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/attio-on-sign-up' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
