const express = require('express');
const { Question, Test } = require('../models');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Add a question to a test
router.post('/tests/:testId/questions', authMiddleware, async (req, res) => {
  const { testId } = req.params;
  //console.log('testId:', testId);
  const { text, optionA, optionB, optionC, optionD, correctOption } = req.body;

  try {
    // Check if the test exists
    const test = await Test.findByPk(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const question = await Question.create({
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      testId,
    });

    res.status(201).json({ message: 'Question added successfully!', question });
  } catch (err) {
    console.error('Error adding question:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all questions for a test
router.get('/tests/:testId/questions', authMiddleware, async (req, res) => {
  const { testId } = req.params;

  try {
    const questions = await Question.findAll({ where: { testId } });
    res.status(200).json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;