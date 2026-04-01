import pool from '../models/database.js';
import { logActivity } from '../utils/activityLogger.js';

// Listar todos os cursos (qualquer usuário autenticado pode ver)
export async function listCourses(req, res) {
  try {
    const [courses] = await pool.query(
      'SELECT id, name, is_active, created_at FROM courses ORDER BY name ASC'
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
      return res.status(400).json({ message: 'Nome do curso é obrigatório' });
    }

    const trimmedName = String(name).trim();
    const [result] = await pool.query(
      'INSERT INTO courses (name) VALUES (?)',
      [trimmedName]
    );

    await logActivity(
      'Criar Curso',
      `Curso criado: ${trimmedName}`,
      req.user?.email || 'Sistema'
    );

    res.status(201).json({ id: result.insertId, name: trimmedName, is_active: true });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Já existe um curso com esse nome' });
    }
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ message: 'Erro ao criar curso' });
  }
}

// Atualizar curso (apenas supervisor)
export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Nome do curso é obrigatório' });
    }

    const trimmedName = String(name).trim();
    const active = is_active !== false && is_active !== 'false';

    const [result] = await pool.query(
      'UPDATE courses SET name = ?, is_active = ? WHERE id = ?',
      [trimmedName, active, Number(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    res.json({ message: 'Curso atualizado com sucesso' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Já existe um curso com esse nome' });
    }
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ message: 'Erro ao atualizar curso' });
  }
}

// Remover curso (apenas supervisor, somente se não houver usuários vinculados)
export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    const [course] = await pool.query('SELECT name FROM courses WHERE id = ?', [Number(id)]);
    if (course.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    const courseName = course[0].name;

    // Bloquear exclusão se houver usuários vinculados a este curso
    const [users] = await pool.query(
      'SELECT COUNT(*) AS total FROM users WHERE sector = ?',
      [courseName]
    );
    if (users[0].total > 0) {
      return res.status(400).json({
        message: `Não é possível excluir: ${users[0].total} usuário(s) vinculado(s) a este curso`
      });
    }

    await pool.query('DELETE FROM courses WHERE id = ?', [Number(id)]);

    await logActivity(
      'Remover Curso',
      `Curso removido: ${courseName}`,
      req.user?.email || 'Sistema'
    );

    res.json({ message: 'Curso removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover curso:', error);
    res.status(500).json({ message: 'Erro ao remover curso' });
  }
}
