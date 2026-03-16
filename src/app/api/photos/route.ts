import { NextResponse } from "next/server";

export async function GET() {
  try {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({ error: "Falta la URL del Apps Script en el .env" }, { status: 500 });
    }

    // Llamar al endpoint GET del Apps Script
    const res = await fetch(scriptUrl);
    const data = await res.json();

    if (!data.success) {
       throw new Error(data.error || "Error al leer desde Google Script");
    }

    return NextResponse.json({ photos: data.photos || [] }, {
        // Headers para evitar caché y que las fotos nuevas se vean rápido
        headers: {
            "Cache-Control": "no-store, max-age=0",
        }
    });

  } catch (error: any) {
    console.error("Fetch photos error via Script:", error);
    return NextResponse.json({ error: "Error al obtener las fotos del servidor", details: error.message }, { status: 500 });
  }
}

