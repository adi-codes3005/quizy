const express = require('express');
const { Test, Question, UserTestResult } = require('../models');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Start a test: Fetch all questions for the test
router.get('/:testId/start', authMiddleware, async (req, res) => {
  const { testId } = req.params;

  try {
    // Check if the test exists
    const test = await Test.findByPk(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Fetch all questions for the test (exclude correct answers)
    const questions = await Question.findAll({
      where: { testId },
      attributes: ['id', 'text', 'optionA', 'optionB', 'optionC', 'optionD'],
    });

    res.status(200).json({ test, questions });
  } catch (err) {
    console.error('Error fetching test questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit test answers and calculate score
router.post('/:testId/submit', authMiddleware, async (req, res) => {
  const { testId } = req.params;
  const { answers } = req.body; // Array of { questionId, selectedOption }
  const userId = req.user.id;

  try {
    // Check if the test exists
    const test = await Test.findByPk(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Fetch all questions and their correct answers
    const questions = await Question.findAll({ where: { testId } });

    let score = 0;
    for (const question of questions) {
      const userAnswer = answers.find((a) => a.questionId === question.id);
      if (userAnswer && userAnswer.selectedOption === question.correctOption) {
        score += 1;
      }
    }

    // Save the test result to the database
    await UserTestResult.create({
      userId,
      testId,
      score,
      completedAt: new Date(),
    });

    res.status(200).json({ message: 'Test submitted successfully!', score });
  } catch (err) {
    console.error('Error submitting test:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;