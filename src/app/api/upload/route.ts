import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const guestName = formData.get("guestName") as string;

    if (!file || !guestName) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // El control de límite de 10 fotos ahora se maneja estrictamente 
    // en el dispositivo del usuario mediante localStorage (Frontend).

    // Preparar el archivo como Base64 para mandarlo al Apps Script
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    
    const payload = {
      filename: file.name,
      mimeType: file.type,
      guestName: guestName,
      base64: `data:${file.type};base64,${base64Data}`
    };

    // Llamar al Google Apps Script
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) throw new Error("Falta la URL del Apps Script en el .env");

    const scriptRes = await fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const scriptData = await scriptRes.json();

    if (!scriptData.success) {
      throw new Error(scriptData.error || "Error en el Google Script");
    }

    return NextResponse.json({ 
      success: true, 
      fileId: scriptData.id
    });

  } catch (error: any) {
    console.error("Upload error via Script:", error);
    return NextResponse.json(
      { error: "Error conectando a tu Drive", details: error.message }, 
      { status: 500 }
    );
  }
}


