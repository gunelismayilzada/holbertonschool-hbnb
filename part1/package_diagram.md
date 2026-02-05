# High-Level Package Diagram  HBnB Application

This document describes the high-level package diagram of the HBnB application based on a three-layer architecture. It also explains how the Facade Pattern is used for communication between layers.

---

## High-Level Package Diagram (Mermaid)

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
