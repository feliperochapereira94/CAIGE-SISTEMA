import pool from "./database.js";

function normalizarEspacos(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function corrigirMojibake(value) {
  const text = normalizarEspacos(value);

  if (!text || !/[ÃÂ�]/.test(text)) {
    return text;
  }

  try {
    return Buffer.from(text, "latin1").toString("utf8");
  } catch {
    return text;
  }
}

function normalizarChave(value) {
  return corrigirMojibake(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizarTipo(type, description) {
  const typeKey = normalizarChave(type);
  const descriptionKey = normalizarChave(description);

  if (
    typeKey === "novo cadastro" ||
    descriptionKey.startsWith("novo paciente cadastrado") ||
    descriptionKey.startsWith("paciente atualizado") ||
    descriptionKey.startsWith("paciente desativado") ||
    descriptionKey.startsWith("paciente reativado") ||
    descriptionKey.startsWith("paciente desabilitado")
  ) {
    return descriptionKey.startsWith("novo usuario criado") ? "Usuário" : "Paciente";
  }

  if (
    descriptionKey.startsWith("novo usuario criado") ||
    descriptionKey.startsWith("usuario atualizado") ||
    descriptionKey.startsWith("usuario ativado") ||
    descriptionKey.startsWith("usuario inativado") ||
    descriptionKey.startsWith("usuario desabilitado")
  ) {
    return "Usuário";
  }

  if (typeKey === "perguntas") {
    return "Pergunta";
  }

  if (typeKey === "questionarios") {
    return "Questionário";
  }

  if (typeKey === "criar curso" || typeKey === "remover curso") {
    return "Curso";
  }

  if (typeKey === "configuracao") {
    return "Sistema";
  }

  const tipoNormalizado = corrigirMojibake(type);
  return tipoNormalizado || "Sistema";
}

export async function logActivity(type, description, responsible = "Sistema") {
  try {
    const tipoNormalizado = normalizarTipo(type, description);
    const descricaoNormalizada = corrigirMojibake(description);
    const responsavelNormalizado = corrigirMojibake(responsible) || "Sistema";

    await pool.query(
      `INSERT INTO atividades (tipo, descricao, responsavel, criado_em)
       VALUES (?, ?, ?, NOW())`,
      [tipoNormalizado, descricaoNormalizada, responsavelNormalizado]
    );
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
  }
}

