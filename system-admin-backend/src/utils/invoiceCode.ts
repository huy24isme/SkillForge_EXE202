export async function generateUniqueInvoiceCode(dbClient: any): Promise<string> {
  const year = new Date().getFullYear();

  // Find highest existing numeric sequence in system_invoices
  const maxRes = await dbClient.query(`
    SELECT COALESCE(MAX(
      CASE 
        WHEN invoice_code ~ '^SKF-[0-9]{4}-[0-9]+$' 
        THEN SUBSTRING(invoice_code FROM 'SKF-[0-9]{4}-([0-9]+)')::int 
        ELSE 0 
      END
    ), 0) as max_seq 
    FROM system_invoices
  `);

  let nextSeq = Number(maxRes.rows[0]?.max_seq || 0) + 1;
  let candidateCode = `SKF-${year}-${String(nextSeq).padStart(4, '0')}`;

  // Loop check DB uniqueness to eliminate duplicate constraint errors 100%
  let dupCheck = await dbClient.query(`SELECT 1 FROM system_invoices WHERE invoice_code = $1`, [candidateCode]);
  while (dupCheck.rows.length > 0) {
    nextSeq += 1;
    candidateCode = `SKF-${year}-${String(nextSeq).padStart(4, '0')}`;
    dupCheck = await dbClient.query(`SELECT 1 FROM system_invoices WHERE invoice_code = $1`, [candidateCode]);
  }

  return candidateCode;
}
