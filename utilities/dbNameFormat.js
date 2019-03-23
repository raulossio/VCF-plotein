export default (dbName) => {
  dbName = dbName.toLowerCase()
  if (dbName.includes('gnomad')) return 'gnomAD'
  if (dbName.includes('dbsnp')) return 'dbSNP'
  if (dbName.includes('clinvar')) return 'ClinVar'
  if (dbName.includes('cosmic')) return 'COSMIC'
  if (dbName.includes('dbptm')) return 'dpPTM'
  throw Error(`db name not found: ${dbName}`)
}
