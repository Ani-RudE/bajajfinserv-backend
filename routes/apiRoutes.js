const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// GET endpoint
router.get('/', (req, res) => {
     res.status(200).json({ operation_code: 1 });
});

// POST endpoint
router.post('/', async (req, res) => {
     try {
          const { data } = req.body;

          if (!Array.isArray(data)) {
               return res.status(400).json({ is_success: false, error: 'Invalid input format' });
          }

          const numbers = data.filter(item => !isNaN(item));
          const alphabets = data.filter(item => isNaN(item) && item.length === 1);
          const highest_alphabet = alphabets.length > 0 ? [alphabets.reduce((a, b) => a.toLowerCase() > b.toLowerCase() ? a : b)] : [];

          // Fetch user from database
          let user = await User.findOne();

          // If no user exists, create a default user
          if (!user) {
               user = new User({
                    user_id: 'aniruddha_1802',
                    email: 'aniruddha@gmail.com',
                    roll_number: 'AP21110011194'
               });
               await user.save();
          }

          res.status(200).json({
               is_success: true,
               user_id: user.user_id,
               email: user.email,
               roll_number: user.roll_number,
               numbers: numbers,
               alphabets: alphabets,
               highest_alphabet: highest_alphabet
          });
     } catch (error) {
          console.error('Error in POST /bfhl:', error);
          res.status(500).json({ is_success: false, error: error.message });
     }
});

// router.options('/bfhl', cors(corsOptions)); // Enable pre-flight request for POST request
// router.post('/bfhl', cors(corsOptions), yourExistingPostHandler);

module.exports = router;