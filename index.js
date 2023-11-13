import express from 'express';
import fs from 'fs';
import joi from 'joi';

const app = express();

const PORT = 3000;
const database = './database/db.json';
const data = JSON.parse(fs.readFileSync(database));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const handleServerError = (res) => {
  return res.status(500).json({ message: 'Internal Server Error' });
};

const handleClientError = (res, status, message) => {
  return res.status(status).json({ message });
};

const TYPES = {
  heroes: ['intelligence', 'agility', 'strength', 'universal'],
  items: ['physical', 'magical', 'utility'],
};

// makes text insensitive and removes spaces
const normalizeString = (str) =>
  str ? str.toLowerCase().replace(/\s/g, '') : '';

const validateURLParams =
  (requiresCategory = true) =>
  (req, res, next) => {
    const { type, category } = req.params;

    if (!TYPES[type] || (requiresCategory && !TYPES[type].includes(category))) {
      return handleClientError(res, 400, 'Invalid URL');
    }

    next();
  };
const validateDataExists = (req, res, next) => {
  const { type, category, name } = req.params;

  if (
    !data[type][category].find(
      (obj) => normalizeString(obj.name) === normalizeString(name)
    )
  ) {
    return handleClientError(res, 404, 'Data Not Found');
  }

  next();
};

const validateAndUpdateData = (req, res, next) => {
  const { type, category, name } = req.params;
  const newData = req.body;

  const conflictingItem = data[type][category].find(
    (obj) =>
      normalizeString(obj.name) === normalizeString(newData.name) &&
      normalizeString(obj.name) !== normalizeString(name)
  );

  if (conflictingItem) {
    return handleClientError(
      res,
      400,
      'Data with the same name already exists'
    );
  }

  const validator = joi.object({
    name: joi.string().min(3).required().messages({
      'any.required': 'Name is required',
      'string.min': 'Name length must be at least {#limit} characters long',
    }),
    description: joi.string().min(10).required().messages({
      'any.required': 'Description is required',
      'string.min':
        'Description length must be at least {#limit} characters long',
    }),
  });

  const { error } = validator.validate(newData);

  if (error) {
    return res.status(400).json({
      status: 'Validation Failed',
      message: error.details[0].message,
    });
  }

  next();
};

app.get('/all/:type', validateURLParams(false), (req, res) => {
  try {
    const { type } = req.params;
    return res.status(200).json({ data: data[type], status: 'Success' });
  } catch (error) {
    return handleServerError(res);
  }
});

app.get('/all/:type/:category', validateURLParams(), (req, res) => {
  try {
    const { type, category } = req.params;

    return res
      .status(200)
      .json({ data: data[type][category], status: 'Success' });
  } catch (error) {
    return handleServerError(res);
  }
});

app.get(
  '/all/:type/:category/:name',
  validateURLParams(),
  validateDataExists,
  (req, res) => {
    try {
      const { type, category, name } = req.params;

      const selectedName = data[type][category].filter(
        (obj) => normalizeString(obj.name) === normalizeString(name)
      );
      return res
        .status(200)
        .json({ data: selectedName[0], message: 'Success' });
    } catch (error) {
      return handleServerError(res);
    }
  }
);

app.post(
  '/new/:type/:category',
  validateURLParams(),
  validateAndUpdateData,
  (req, res) => {
    try {
      const { type, category } = req.params;
      const newData = req.body;

      data[type][category].push(newData);
      fs.writeFileSync(database, JSON.stringify(data));

      return res
        .status(201)
        .json({ data: data[type][category], status: 'Success' });
    } catch (error) {
      return handleServerError(res);
    }
  }
);

app.put(
  '/all/:type/:category/:name',
  validateURLParams(),
  validateDataExists,
  validateAndUpdateData,
  (req, res) => {
    try {
      const { type, category, name } = req.params;
      const updatedData = req.body;

      const filtered = data[type][category].filter(
        (obj) => normalizeString(obj.name) !== normalizeString(name)
      );
      filtered.push(updatedData);

      data[type][category] = filtered;
      fs.writeFileSync(database, JSON.stringify(data));

      return res
        .status(200)
        .json({ data: data[type][category], message: 'Success' });
    } catch (error) {
      return handleServerError(res);
    }
  }
);

app.delete(
  '/all/:type/:category/:name',
  validateURLParams(),
  validateDataExists,
  (req, res) => {
    try {
      const { type, category, name } = req.params;

      const filtered = data[type][category].filter(
        (obj) => normalizeString(obj.name) !== normalizeString(name)
      );

      data[type][category] = filtered;
      fs.writeFileSync(database, JSON.stringify(data));

      return res
        .status(200)
        .json({ data: data[type][category], message: 'Success' });
    } catch (error) {
      return handleServerError(res);
    }
  }
);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
