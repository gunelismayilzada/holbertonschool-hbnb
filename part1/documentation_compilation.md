HBnB Application Technical Documentation

The HBnB application is a simplified AirBnB-like platform that allows users to register, create and browse places, submit reviews, and manage amenities. This technical document serves as a comprehensive blueprint for the project, detailing the systems architecture, the design of the Business Logic layer, and the interactions within the application through API calls.

This document will guide developers through the implementation phase and serve as a reference for understanding the system's design decisions.
-------------------------
High-Level Architecture

HBnB uses a three-layer architecture:

Presentation Layer: Handles user interactions through APIs.

Business Logic Layer: Contains core entities and business rules.

Persistence Layer: Responsible for data storage and retrieval.

The Facade Pattern is applied in the Presentation Layer to simplify communication with the Business Logic Layer, ensuring that the API endpoints do not directly manipulate business entities or repositories.


Package Diagram

```mermaid
classDiagram

%% ========== PRESENTATION LAYER ==========
class PresentationLayer {
  <<Facade >>
  +UserService
  +PlaceService
  +ReviewService
  +AmenityService
  +API_Endpoints
}

%% ========== BUSINESS LOGIC LAYER ==========
class BusinessLogicLayer {
  +User
  +Place
  +Review
  +Amenity
  +BusinessRules
}

%% ========== PERSISTENCE LAYER ==========
class PersistenceLayer {
  +UserRepository
  +PlaceRepository
  +ReviewRepository
  +AmenityRepository
  +Database
}

%% ========== RELATIONSHIPS ==========
PresentationLayer --> BusinessLogicLayer : Facade Pattern
BusinessLogicLayer --> PersistenceLayer : CRUD Operations

```
Explanatory Notes:

PresentationLayer exposes services through API endpoints and uses a facade to communicate with the Business Logic Layer.

BusinessLogicLayer implements the application's core logic and rules.

PersistenceLayer manages all interactions with the database, abstracting the CRUD operations from the business logic.

--------------------------------

Class Diagram

The Business Logic Layer encapsulates the main entities of the application and their relationships. It ensures consistency, enforces business rules, and coordinates interactions with the Persistence Layer.

```mermaid
classDiagram

class BaseModel {
  +UUID4 id
  +datetime created_at
  +datetime updated_at
  +save()
  +update()
  +delete()
}

class User {
  +UUID4 id
  +string email
  +string password
  +string first_name
  +string last_name
  +datetime created_at
  +datetime updated_at
  +create_user()
  +update_profile()
  +delete_user()
}

class Place {
  +UUID4 id
  +string name
  +string description
  +float price_per_night
  +UUID4 owner_id
  +datetime created_at
  +datetime updated_at
  +create_place()
  +update_place()
  +delete_place()
}

class Review {
  +UUID4 id
  +string comment
  +int rating
  +UUID4 user_id
  +UUID4 place_id
  +datetime created_at
  +datetime updated_at
  +create_review()
  +update_review()
  +delete_review()
}

class Amenity {
  +UUID4 id
  +string name
  +datetime created_at
  +datetime updated_at
  +create_amenity()
  +update_amenity()
  +delete_amenity()
}

BaseModel <|-- User
BaseModel <|-- Place
BaseModel <|-- Review
BaseModel <|-- Amenity

User "1" --> "0..*" Place : owns
User "1" --> "0..*" Review : writes
Place "1" --> "0..*" Review : receives
Place "0..*" -- "0..*" Amenity : has

```
-------------------------------------------
BaseModel - All models use this.

User - Represents a user, a user can create places and write reviews.

Place - Represents a place listed by a user, belongs to one user, can have many reviews, and many amenities.

Amenity - Represents a feature of a place.

------------------------------------------

Sequence Diagrams

```mermaid
sequenceDiagram
    participant User
    participant API as API Layer
    participant BL as Business Logic
    participant DB as Database

    User->>API: POST /users (registration data)
    API->>BL: validateUserData(data)
    BL->>DB: saveUser(data)
    DB-->>BL: userSaved
    BL-->>API: return success response
    API-->>User: 201 Created (User registered)
```
User submits registration data.
API Layer validates and forwards the request to Business Logic.
Business Logic saves the user through the Persistence Layer.

## 2. Place Creation
```mermaid
sequenceDiagram
    participant User
    participant API as API Layer
    participant BL as Business Logic
    participant DB as Database

    User->>API: POST /places (place data)
    API->>BL: createPlace(data)
    BL->>DB: insertPlace(data)
    DB-->>BL: placeSaved
    BL-->>API: return place details
    API-->>User: 201 Created (Place added)
```
Users create new places.
Business Logic ensures that the place is associated with the correct user and persists it via the database.

## 3. Review Submission
```mermaid
sequenceDiagram
    participant User
    participant API as API Layer
    participant BL as Business Logic
    participant DB as Database

    User->>API: POST /reviews (review text + rating)
    API->>BL: submitReview(data)
    BL->>DB: insertReview(data)
    DB-->>BL: reviewSaved
    BL-->>API: return review details
    API-->>User: 201 Created (Review submitted)
```
Users submit reviews for places.
Business Logic ensures correct linkage to User and Place entities.

## 4. Fetching List of Places
```mermaid
sequenceDiagram
    participant User
    participant API as API Layer
    participant BL as Business Logic
    participant DB as Database

    User->>API: GET /places?city=Baku&min_price=50
    API->>BL: getPlaces(filters)
    BL->>DB: queryPlaces(filters)
    DB-->>BL: return matching places
    BL-->>API: formatted list of places
    API-->>User: 200 OK (List of places)
```
Users fetch available places using filters.
Business Logic applies the filtering and retrieves matching places from the database.

------------------------------------

This document provides a clear, structured view of the HBnB application:

Architecture: Three-layered, with Facade Pattern in Presentation Layer.
Business Logic Layer: Detailed class diagram with entity relationships.
API Interaction: Sequence diagrams illustrating core use cases.