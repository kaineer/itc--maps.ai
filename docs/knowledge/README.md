# Knowledge Base

This directory contains the technical knowledge and architectural documentation for the Maps.ai project.

## Project Overview

Maps.ai is a frontend application for displaying interactive maps with AI-powered features. The application supports multiple modes of operation and integrates 3D building models with geographic data.

## Core Architecture

### Technical Stack
- **Frontend**: React-based application
- **3D Rendering**: @react-three/fiber for WebGL rendering
- **Map Data**: OpenStreetMap integration
- **Model Format**: FBX for 3D building models

### Key Components

#### Base Objects
- **[Base Objects](types/base-objects.md)** - Fundamental object types and data structures
- Core entities and their relationships
- Common interfaces and type definitions

#### Building System
- **[Building Types](types/building.md)** - Building data structures and management
- Model replacement system
- Address-based building positioning

#### Tracks & Navigation
- **[Tracks System](types/tracks.md)** - Tour and navigation functionality
- Waypoint management
- Movement constraints and restrictions

## Operational Modes

### 1. Free Exploration Mode
- Unrestricted movement through the city
- Debug/demonstration functionality
- Arrow key navigation

### 2. Building Management Mode
- Add new buildings to replace existing structures
- Address-based positioning system
- Visual overlay for position adjustment
- Simultaneous display of model and bounding box

### 3. Moderation Mode
- Approval workflow for user-submitted models
- Quality control for building models
- Model validation before public display

### 4. Tour Editing Mode
- Create and manage guided tours
- Waypoint-based navigation
- Movement constraints per point
- HTML content display at tour points
- Distance-based building loading optimization

## Data Flow

### Building Integration
1. User uploads FBX model
2. System associates model with address
3. Model replaces OpenStreetMap building
4. Position can be fine-tuned with visual feedback

### Tour Management
1. Define tour waypoints with coordinates
2. Set movement constraints per waypoint
3. Associate HTML content with points
4. Optimize building loading based on proximity

## Development Guidelines

### Model Requirements
- Primary format: FBX
- Must include proper scale and orientation
- Should match real-world building dimensions
- Quality standards for public display

### Performance Considerations
- Lazy loading of distant buildings
- Progressive model quality based on distance
- Efficient memory management for large scenes

## Related Documentation

- **[Guides](../guides/)** - Development workflows and tutorials
- **[Main Documentation](../README.md)** - Project overview and quick start
- **[Project Root](../../README.md)** - High-level project information

---

*This knowledge base provides the technical foundation for understanding and contributing to the Maps.ai project.*