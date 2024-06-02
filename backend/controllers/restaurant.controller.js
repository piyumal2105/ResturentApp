import Resturent from "../models/restaurant.model.js";

const generateResturentId = async () => {
  // Get the last resturent, sorted by _id in descending order
  const lastResturentDetails = await Resturent.find()
    .sort({ _id: -1 })
    .limit(1);

  // Check if there are any resturents
  if (lastResturentDetails.length === 0) {
    return "Resturent-1"; // Return the first resturent ID if no resturent are found
  }

  const lastId = lastResturentDetails[0].cusReturentID;
  const lastNumber = parseInt(lastId.split("-")[1]);
  const newIdNumber = lastNumber + 1;

  // Return the new resturent ID
  return `Resturent-${newIdNumber}`;
};

// add resturent to the database
export const addResturent = async (req, res) => {
  try {
    // Generate resturent ID
    const resId = await generateResturentId();

    const newResturent = new Resturent({
      cusReturentID: resId,
      name: req.body.name,
      address: req.body.address,
      telephone: req.body.telephone,
      image: req.body.image,
    });

    const savedResturent = await newResturent.save();

    console.log(newResturent);

    res.status(201).json(savedResturent);
  } catch (err) {
    console.error(err.message); // More specific logging for debugging
    res
      .status(500)
      .json({ error: "Failed to add resturent", details: err.message }); // Standardized error response
  }
};

//get all added data
export const getAllItems = async (req, res) => {
  try {
    const resturent = await Resturent.find(); // Fetch all the resturent from the database

    res.status(200).json(resturent); // Send the resturent as the response
    console.log(resturent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch resturent", error: error.message }); // Standardized error response
  }
};

//get by id
export const getResturentById = async (req, res) => {
  const resturentId = req.params.id;

  try {
    const resturent = await Resturent.findById(resturentId);
    if (!resturent) {
      return res.status(404).json({ message: "Resturent not found" });
    }

    res.status(200).json(resturent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch resturent", error: error.message });
  }
};

//Update resturent
export const updateResturent = async (req, res) => {
  const resturent_id = req.params.id;

  console.log(req.body);
  const updateFields = {
    name: req.body.name,
    address: req.body.address,
    telephone: req.body.telephone,
    image: req.body.image,
  };

  try {
    const updateResturent = await Resturent.findByIdAndUpdate(
      resturent_id,
      updateFields,
      { new: true }
    );

    if (!updateResturent) {
      return res.status(404).json({ message: "Resurent not found" });
    }

    res.status(200).json(updateResturent);
  } catch (error) {
    res.status(500).json({ message: "Failed to update Resturent", error });
  }
};

//delete resturent
export const deleteResturent = async (req, res) => {
  const _id = req.params.id;

  try {
    const resturentDelete = await Resturent.findByIdAndDelete(_id);

    if (!resturentDelete) {
      return res.status(404).json({ message: "Resturent not found" });
    }

    res.status(200).json({ message: "Resturent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Resturent", error });
  }
};
