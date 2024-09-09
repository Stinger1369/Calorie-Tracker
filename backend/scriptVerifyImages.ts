const mongoose = require('mongoose');
const fetch = require('node-fetch'); // Make sure to install this: npm install node-fetch

// Connect to MongoDB (adjust the connection string if needed)
mongoose.connect('mongodb://localhost:27017/nest');


// Define your schema for `fitnessExercice`
const ExerciseSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  description: String,
  muscleGroup: String,
  imageExists: Boolean, // Field to track if the image exists
});

const Exercise = mongoose.model('fitnessExercice', ExerciseSchema);

// Function to check if an image exists by sending an HTTP HEAD request
const checkImageExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok; // Returns true if the response status is 200
  } catch (error) {
    console.error(`Error checking image: ${url}`, error);
    return false;
  }
};

// Function to iterate through all exercises and check if their images exist
const verifyImages = async () => {
  try {
    const exercises = await Exercise.find();

    for (let exercise of exercises) {
      if (exercise.imageUrl) {
        const exists = await checkImageExists(exercise.imageUrl);

        // Update the document with the imageExists field
        await Exercise.updateOne(
          { _id: exercise._id },
          { $set: { imageExists: exists } }
        );

        console.log(`Image for ${exercise.title} exists: ${exists}`);
      } else {
        console.log(`No image URL for ${exercise.title}`);
      }
    }

    console.log("Image verification complete");
  } catch (error) {
    console.error('Error verifying images:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Start the verification process
verifyImages();
