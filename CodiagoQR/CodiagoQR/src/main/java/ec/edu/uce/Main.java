package ec.edu.uce;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) {
        // Asegúrate de usar la IP local correcta, como se mencionó antes
        String arContentUrl = "http://192.168.200.17:5500/dinosaurio.html\n";  // Cambia esta URL por la correcta
        String qrCodePath = "dinosaurio_qr.png";  // Ruta donde se guardará el QR
        int qrWidth = 300;  // Ancho del QR
        int qrHeight = 300;  // Alto del QR

        try {
            generateQRCode(arContentUrl, qrCodePath, qrWidth, qrHeight);
            System.out.println("Código QR generado exitosamente: " + qrCodePath);
        } catch (WriterException | IOException e) {
            System.err.println("Error al generar el QR: " + e.getMessage());
        }
    }

    // Método para generar el código QR
    public static void generateQRCode(String text, String filePath, int width, int height)
            throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        Path path = FileSystems.getDefault().getPath(filePath);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
    }
}
