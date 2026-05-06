const Conversion = require ('../models/conversion');

// save conversion to db
const saveConversion = async (req, res) => {
  try {
    const {from, to, amount, result} = req.body;

    const conversion = await Conversion.create({from, to, amount, result});

    res.status(201).json(conversion);

  } catch (err) {
        console.log(err)
    }
};

// get all 
const getConversions = async (req, res) => {
  try {
    const conversions = await Conversion.find();

    res.json(conversions);

  } catch (err) {
        console.log(err)
    }
};

// get one by id
const getConversion = async (req, res) => {
    const { id } = req.params;

    // guard against non-ObjectId values like "favicon.ico"
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: 'Invalid ID' });
    }

    try {
        const conversion = await Conversion.findById(id);

        if (!conversion) {
            return res.status(404).json({ msg: 'Conversion not found' });
        }

        res.status(200).json(conversion);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// delete one by id
const deleteConversion = async (req, res) => {
    const id = req.params.id;
    try {
        const conversion = await Conversion.findById(id);

        // check if conversion can be found
        if (!conversion) {
        return res.status(404).json({message: "Not found"});
        }

        await conversion.deleteOne();

        res.json({message: "Deleted"});

    } catch (err) {
        console.log(err)
    }
};


module.exports = {
    saveConversion,
    getConversions,
    getConversion,
    deleteConversion
};
