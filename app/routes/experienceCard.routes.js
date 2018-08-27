module.exports = (app) => {
    const experienceCards = require('../controllers/experienceCard.controller.js');

     // Create a new experienceCard
     app.post('/experienceCards', experienceCards.create);
 
     // Retrieve a single experienceCard with experienceCardId
     app.get('/experienceCards/:experienceCardId', experienceCards.findOne);
 
     // Retrieve experienceCards with categoryId
     app.get('/experienceCardsIn/:cardId', experienceCards.findExperienceCardsIn);
 
     // Update a experienceCard with experienceCardId
     app.put('/experienceCards/:experienceCardId', experienceCards.update);
 
     // Delete a experienceCard with experienceCardId
     app.delete('/experienceCards/:experienceCardId', experienceCards.delete);
}