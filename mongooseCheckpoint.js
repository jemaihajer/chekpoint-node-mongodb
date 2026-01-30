require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB Atlas using Mongoose 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("connection error:", err));

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

// Create the Person model
const Person = mongoose.model("Person", personSchema);

// Create and Save a Record of a Model (Promise/async)
const createAndSavePerson = async () => {
  const person = new Person({
    name: "John Doe",
    age: 30,
    favoriteFoods: ["pizza", "pasta"],
  });
  return await person.save();
};

// Create Many Records with Model.create() (Promise/async)
const createManyPeople = async (arrayOfPeople) => {
  return await Person.create(arrayOfPeople);
};

// Use model.find() to Search Your Database (Promise/async)
const findPeopleByName = async (personName) => {
  return await Person.find({ name: personName });
};

// Use model.findOne() to Return a Single Matching Document (Promise/async)
const findOneByFood = async (food) => {
  return await Person.findOne({ favoriteFoods: food });
};

// Use model.findById() to Search By _id (Promise/async)
const findPersonById = async (personId) => {
  return await Person.findById(personId);
};

// Classic Update: Find, Edit, then Save (Promise/async)
const addFoodAndSave = async (personId) => {
  const person = await Person.findById(personId);
  if (!person) throw new Error("Person not found");
  person.favoriteFoods.push("hamburger");
  return await person.save();
};

// New Update: findOneAndUpdate (Promise/async)
const findAndUpdateAge = async (personName) => {
  return await Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true }
  );
};

// Delete One Document Using findByIdAndDelete (Promise/async)
const removeById = async (personId) => {
  return await Person.findByIdAndDelete(personId);
};

// Delete Many Documents with model.deleteMany() (Promise/async)
const removeManyPeople = async () => {
  return await Person.deleteMany({ name: "Mary" });
};

// Chain Search Query Helpers to Narrow Search Results (Promise/async)
const queryChain = async () => {
  return await Person.find({ favoriteFoods: "burritos" })
    .sort("name")
    .limit(2)
    .select("-age")
    .exec();
};

// Export functions for testing or further use

// --- DEMO USAGE (async/await style) ---
(async () => {
  try {
    // 1. Create and save a single person
    const createdPerson = await createAndSavePerson();
    console.log("Created person:", createdPerson);

    // 2. Create many people
    const people = [
      { name: "Mary", age: 25, favoriteFoods: ["burritos", "salad"] },
      { name: "John", age: 22, favoriteFoods: ["pizza"] },
      { name: "Jane", age: 28, favoriteFoods: ["burritos", "sushi"] },
    ];
    const createdPeople = await createManyPeople(people);
    console.log("Created people:", createdPeople);

    // 3. Find people by name
    const foundMarys = await findPeopleByName("Mary");
    console.log("People named Mary:", foundMarys);

    // 4. Find one by favorite food
    const personWhoLikesBurritos = await findOneByFood("burritos");
    console.log("Person who likes burritos:", personWhoLikesBurritos);
    if (!personWhoLikesBurritos) return process.exit(0);

    // 5. Find by ID
    const foundById = await findPersonById(personWhoLikesBurritos._id);
    console.log("Found by ID:", foundById);

    // 6. Add food and save
    const updatedWithHamburger = await addFoodAndSave(
      personWhoLikesBurritos._id
    );
    console.log("Added hamburger to favoriteFoods:", updatedWithHamburger);

    // 7. Update age by name
    const updatedMary = await findAndUpdateAge("Mary");
    console.log("Updated Mary age to 20:", updatedMary);

    // 8. Remove by ID
    const removedById = await removeById(personWhoLikesBurritos._id);
    console.log("Removed by ID:", removedById);

    // 9. Remove all Marys
    const removedMarys = await removeManyPeople();
    console.log("Removed all Marys:", removedMarys);

    // 10. Query chain
    const queryResult = await queryChain();
    console.log("Query chain result:", queryResult);
  } catch (err) {
    console.error("Demo error:", err);
  } finally {
    process.exit(0);
  }
})();
