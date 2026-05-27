import ExcelJS from 'exceljs';
import Gasto from '../models/gastos.js'; // Importación por defecto corregida

export const exportarAExcel = async (req, res) => {
    try {
        // 1. Obtener los gastos del usuario autenticado por Firebase (inyectado en req.user)
        // Buscamos por el uid del usuario y los ordenamos de más reciente a más antiguo
        const transacciones = await Gasto.find({ usuarioId: req.user.uid }).sort({ createdAt: -1 });

        // 2. Crear el libro y la hoja de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Historial Financiero');

        // 3. Configurar columnas y encabezados
        worksheet.columns = [
            { header: 'Descripción', key: 'descripcion', width: 30 },
            { header: 'Tipo', key: 'tipo', width: 15 },
            { header: 'Cuenta', key: 'cuenta', width: 15 },
            { header: 'Categoría', key: 'categoria', width: 20 },
            { header: 'Monto ($)', key: 'monto', width: 15, style: { numFmt: '$#,##0.00' } },
            { header: 'Fecha', key: 'fecha', width: 15 }
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '047857' } // Esmeralda 700 de Tailwind
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;

        // 4. Agregar los datos con estilos condicionales y formato numérico
        const listaTransacciones = transacciones || [];
        
        listaTransacciones.forEach((t, index) => {
            const fechaFormateada = t.createdAt 
                ? new Date(t.createdAt).toLocaleDateString('es-EC') 
                : new Date().toLocaleDateString('es-EC');

            const fila = worksheet.addRow({
                descripcion: t.descripcion,
                tipo: t.tipo,
                cuenta: t.cuenta,
                categoria: t.categoria,
                monto: Number(t.monto || 0),
                fecha: fechaFormateada
            });

            fila.font = { name: 'Segoe UI', size: 10 };
            fila.height = 20;

            const celdaMonto = fila.getCell('monto');
            const celdaTipo = fila.getCell('tipo');

            if (t.tipo === 'Gasto') {
                celdaMonto.font = { name: 'Segoe UI', color: { argb: 'DC2626' }, bold: true }; // Rojo
                celdaTipo.font = { name: 'Segoe UI', color: { argb: 'DC2626' } };
            } else {
                celdaMonto.font = { name: 'Segoe UI', color: { argb: '16A34A' }, bold: true }; // Verde
                celdaTipo.font = { name: 'Segoe UI', color: { argb: '16A34A' } };
            }

            if (index % 2 === 1) {
                fila.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F9FAFB' }
                };
            }

            // Aplicar bordes finos gris claro a cada celda
            fila.eachCell((cell) => {
                cell.border = {
                    bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
                    top: { style: 'thin', color: { argb: 'E5E7EB' } }
                };
            });
        });

        // 5. Agregar Fila de Totales con fórmulas reales de Excel de forma dinámica
        const totalFilaIndex = listaTransacciones.length > 0 ? listaTransacciones.length + 3 : 3;
        worksheet.spliceRows(totalFilaIndex, 0, []);

        worksheet.getCell(`A${totalFilaIndex}`).value = 'RESUMEN DE CUENTA';
        worksheet.getCell(`A${totalFilaIndex}`).font = { name: 'Segoe UI', bold: true, size: 11 };

        const filaGastos = worksheet.addRow(['Total Gastos (Fórmula Excel):', '', '', '', { formula: `SUMIF(B2:B${totalFilaIndex-2}, "Gasto", E2:E${totalFilaIndex-2})` }]);
        filaGastos.getCell(5).font = { color: { argb: 'DC2626' }, bold: true, name: 'Segoe UI' };
        filaGastos.getCell(5).numFmt = '$#,##0.00';

        const filaIngresos = worksheet.addRow(['Total Ingresos (Fórmula Excel):', '', '', '', { formula: `SUMIF(B2:B${totalFilaIndex-1}, "Ingreso", E2:E${totalFilaIndex-1})` }]);
        filaIngresos.getCell(5).font = { color: { argb: '16A34A' }, bold: true, name: 'Segoe UI' };
        filaIngresos.getCell(5).numFmt = '$#,##0.00';

        // 6. Configurar las cabeceras de respuesta para descarga forzada de archivo Excel (.xlsx)
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=Reporte_Financiero_NoTanDeUna.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error al generar el Excel:', error);

        if (!res.headersSent) {
            res.status(500).json({ mensaje: 'Error interno al compilar el reporte de Excel' });
        }
    }
};