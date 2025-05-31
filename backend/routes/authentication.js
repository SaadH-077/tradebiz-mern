import express from "express";
import UserModel from "../models/UserModel.js"; 
import TradeModel from "../models/TradeModel.js";
import OfferModel from "../models/OfferModel.js";

// Creating a new instance of the express router
const router = express.Router();

// Creating a route to sign up a new user
router.post("/signup", async (req, res) => {
  // console.log("REQUEST BODY: ", req.body); // Debugging statement to check the request body
  try 
  {

    // Extracting the user details from the request body
    const {
      name_,
      username_,
      password_,
      email_,
    } = req.body;

    // Basic input validation
    if (!name_ || !username_ || !password_ || !email_) 
    {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }


    // console.log("Validated Inputs: ", { name_, username_, password_, email_ });

    /// Check if the username or email already exists
  let existingUserName = await UserModel.findOne({ username: String(username_) });
  if (existingUserName) 
  {
    console.log(`Username '${username_}' already exists.`);
    return res.status(400).json({ success: false, message: "Username already exists." });
  }

  let existingUserEmail = await UserModel.findOne({ email: String(email_) });
  if (existingUserEmail) 
  {
    console.log(`Email '${email_}' already exists.`);
    return res.status(400).json({ success: false, message: "Email already exists." });
  }

    // console.log("Creating user");
    const newUser = new UserModel({ name:String(name_), username:String(username_), password:password_, email:email_ });

    // console.log("Saving user", newUser);
    const savedUser = await newUser.save();

    // console.log("Offer saved successfully:", savedUser);
    res.status(201).json({ success: true, message: "User created successfully" });
    // res.json({ success: true, offer: savedUser });
  } 
  catch (error) 
  {
    // Sending an error response if something goes wrong
    console.log(error)
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
    try 
    {
      // Extracting the user details from the request body
      const {
        username,
        password
      } = req.body;

      // console.log("Username: ", username); // Debugging statement to check the extracted user details
      // console.log("password: ", password);
  
      // Finding the user record
      const user = await UserModel.findOne({ username });

      if (!user) 
      {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      // Checking if the user record exists and the password matches
      if (user && user.password === password) 
      {
        // Sending a success response
        res.status(200).json({
          success: true,
          message: "Login successful",
          user: { id: user._id, name: user.name, username: user.username } // Send only non-sensitive data
        });
      } 
      else 
      {
        // Sending an error response if the user record does not exist or the password does not match
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } 
    catch (error) 
    {
      // Sending an error response if something goes wrong
      res.status(500).json({ success: false, message: error.message });
    }
  });


  router.get('/change-password', async (req, res) => {
    const { username, currentPassword, newPassword } = req.query;

    // console.log("Username: ", username); // Debugging statement to check the extracted user details
    // console.log("Current Password: ", currentPassword);
    // console.log("New Password: ", newPassword);

    if (!username || !currentPassword || !newPassword) 
    {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    try 
    {
        const user = await UserModel.findOne({ username });
        if (!user) 
        {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the current password is correct
        if (currentPassword !== user.password) 
        {
          return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // Update the password in the database
        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// Exporting the router
export { router };
