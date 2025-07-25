const express = require('express');

const router = express.Router();

router.use((req, res, next)=>{
  console.log("this middleware is between router and API");
  next()
})
router.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Cohort"
  });
});

module.exports = router;
