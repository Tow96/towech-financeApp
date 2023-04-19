# shared-features-mongo

This library was generated with [Nx](https://nx.dev).

Library that manages a connection with MongoDb as well as containing abstract Models and Repositories.

## Abstract Model

The abstract model contains the following params:

- \_id
- createdAt

## Abstract Repository

The abstract repository forwards the model's functions with extra functionality to ensure consistency:

- create: Adds the generic parameters
- find: Forwarded from model
- findById: Forwarded from model
- findByIdAndDelete: Forwarded from model
- findByIdAndUpdate: Forwarded from model
- findOne: Forwarded from model
- findOneAndUpdate: Forwarded from model

## Testing

This library contains a MockModel class, which can be used for writing tests.
