import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

// Simple font mapper or just use default system sans
// For 'edge' runtime, we can load fonts if needed, but keeping it simple for now.

export default async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 40,
              color: 'black',
              background: 'white',
              width: '100%',
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            MyCEO Tools
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    }

    // Init Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    // Note: In Edge Runtime, process.env works differently, but Vercel exposes them. 
    // If process.env is undefined, try import.meta.env if bundled with Vite, but this is a standalone function.
    // For Vercel Edge functions, strict env access is required. safely handle it.
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase Config");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: website } = await supabase
        .from('mini_websites')
        .select('data, title, url_slug')
        .eq('url_slug', slug)
        .eq('is_published', true)
        .single();

    if (!website) {
       return new ImageResponse(
        (
          <div
            style={{
              fontSize: 40,
              color: 'black',
              background: '#f3f4f6',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1>Store Not Found</h1>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    }

    const { title } = website;
    // Parse config if needed, or just use the title
    // const config = website.data; 

    return new ImageResponse(
      (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
                backgroundSize: '100px 100px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'white',
                    border: '4px solid #000',
                    borderRadius: '20px',
                    padding: '40px 80px',
                    boxShadow: '10px 10px 0px #000',
                }}
            >
                <div style={{ fontSize: 70, fontWeight: 900, color: '#000', marginBottom: 20 }}>
                    {title || "My Amazing Store"}
                </div>
                <div style={{ fontSize: 32, color: '#666' }}>
                    Check out my shop on MyCEO Tools!
                </div>
                <div style={{ 
                    marginTop: 40,
                    padding: '10px 30px',
                    backgroundColor: '#FFD700',
                    borderRadius: '50px',
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#000'
                }}>
                    Open Now 🚀
                </div>
            </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
