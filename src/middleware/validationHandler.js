import { checkSchema, validationResult } from 'express-validator';

const registrationBodyCheckSchema = checkSchema({
    name : {
        notEmpty : {
            errorMessage : 'Name is required'
        },
        isLength : {
            options : { min : 3 },
            errorMessage : 'Name must be at least 3 characters long'
        }
    },
    password : {
        isLength : {
            options : { min : 8 },
            errorMessage : 'Password must be at least 8 characters long'
        }
    }
})

const usersQueryCheckSchema = checkSchema({
    filter: {
        in: ['query'],
        optional: true,
        isIn: {
          options: [['id', 'name', 'age']],
          errorMessage: 'Filter must be one of [id, name, age]'
        }
      },
      sortBy: {
        in: ['query'],
        optional: true,
        isIn: {
          options: [['id', 'name', 'age']],
          errorMessage: 'SortBy must be one of [id, name, age]'
        }
      },
      order: {
        in: ['query'],
        optional: true,
        custom: {
          options: (value) => value === 'desc',
          errorMessage: 'Order must be "desc"'
        }
      },
      page: {
        in: ['query'],
        optional: true,
        isInt: {
          errorMessage: 'Page must be an integer'
        },
        toInt: true
      },
      limit: {
        in: ['query'],
        optional: true,
        isInt: {
          errorMessage: 'Limit must be an integer'
        },
        toInt: true
      }
})

export const validateRegistrationBody = [
    registrationBodyCheckSchema
    ,
    (req, res, next) => {    
        
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          const error = new Error('Validation failed!');
          error.statusCode = 400;
          error.data = errors.array();  
          return next(error);
        }

        next();
    }
]

export const validateUsersQuery = [
    usersQueryCheckSchema,
    (req, res, next) => {    
        
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          const error = new Error('Validation failed!');
          error.statusCode = 400;
          error.data = errors.array();  
          return next(error);
        }

        next();
    }
]
