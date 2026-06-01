import pool from '../models/database.js';
import { logActivity } from '../models/registroAtividadeModel.js';
import { parsePositiveInt } from '../models/validacaoModel.js';

// Listar todos os cursos (qualquer usuÃ¡rio autenticado pode ver)
export async function listCourses(req, res) {
  try {
    const [courses] = await pool.query(
      'SELECT id, nome AS name, ativo AS is_active, criado_em AS created_at FROM cursos ORDER BY nome ASC'
    );
    res.json(courses);
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    res.status(500).json({ message: 'Erro ao listar cursos' });
  }
}

// Criar curso (apenas supervisor)
export async function createCourse(req, res) {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Nome do curso Ã© obrigatÃ³rio' });
    }

    const trimmedName = String(name).trim();
    const [result] = await pool.query(
      'INSERT INTO cursos (nome) VALUES (?)',
      [trimmedName]
    );

    await logActivity(
      'Curso',
      `Curso criado: ${trimmedName}`,
      req.user?.email || 'Sistema'
    );

    res.status(201).json({ id: result.insertId, name: trimmedName, is_active: true });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'JÃ¡ existe um curso com esse nome' });
    }
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ message: 'Erro ao criar curso' });
  }
}

// Atualizar curso (apenas supervisor)
export async function updateCourse(req, res) {
  try {
    const id = parsePositiveInt(req.params.id);
    const { name, is_active } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID do curso invÃ¡lido' });
    }

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Nome do curso Ã© obrigatÃ³rio' });
    }

    const trimmedName = String(name).trim();
    const active = is_active !== false && is_active !== 'false';

    const [result] = await pool.query(
      'UPDATE cursos SET nome = ?, ativo = ? WHERE id = ?',
      [trimmedName, active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Curso nÃ£o encontrado' });
    }

    res.json({ message: 'Curso atualizado com sucesso' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'JÃ¡ existe um curso com esse nome' });
    }
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ message: 'Erro ao atualizar curso' });
  }
}

// Remover curso (apenas supervisor, somente se nÃ£o houver usuÃ¡rios vinculados)
export async function deleteCourse(req, res) {
  try {
    const id = parsePositiveInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: 'ID do curso invÃ¡lido' });
    }

    const [course] = await pool.query('SELECT nome AS name FROM cursos WHERE id = ?', [id]);
    if (course.length === 0) {
      return res.status(404).json({ message: 'Curso nÃ£o encontrado' });
    }

    const courseName = course[0].name;

    // Bloquear exclusÃ£o se houver usuÃ¡rios vinculados a este curso
    const [users] = await pool.query(
      'SELECT COUNT(*) AS total FROM usuarios WHERE setor = ?',
      [courseName]
    );
    if (users[0].total > 0) {
      return res.status(400).json({
        message: `NÃ£o Ã© possÃ­vel excluir: ${users[0].total} usuÃ¡rio(s) vinculado(s) a este curso`
      });
    }

    await pool.query('DELETE FROM cursos WHERE id = ?', [id]);

    await logActivity(
      'Curso',
      `Curso removido: ${courseName}`,
      req.user?.email || 'Sistema'
    );

    res.json({ message: 'Curso removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover curso:', error);
    res.status(500).json({ message: 'Erro ao remover curso' });
  }
}

