# ADDraw - Active Directory Topology Visualization

A React-based web application that generates comprehensive Active Directory topology diagrams including forest structure, site topology, domain controller placement, replication connections, and trust relationships.

![ADDraw](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-ISC-green)

## Features

- 🌲 **Forest Structure Diagrams** - Visualize all domains in the forest hierarchy
- 🗺️ **Site Topology** - Display AD sites and site links with associated subnets
- 🖥️ **Domain Controller Placement** - Show DCs distributed across sites
- 🔄 **Replication Topology** - Visualize replication connections between domain controllers
- 🤝 **Trust Relationships** - Display trust relationships between domains
- 📥 **Multiple Export Formats** - Export diagrams to PDF, PNG, SVG, and Visio
- 🔒 **Secure** - Credentials stored only in session memory
- 🎨 **Interactive Visualizations** - Zoom, pan, and explore diagrams

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Access to an Active Directory environment (for real data)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/revul93/ADDraw.git
   cd ADDraw
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### 1. Landing Page
When you first open the application, you'll see the landing page with an overview of features. Click **"Get Started"** to begin.

### 2. Connect to Active Directory
Enter your Active Directory credentials:
- **Domain/Server Address**: Your AD server address (e.g., dc.example.com)
- **Port**: LDAP port (default: 389, LDAPS: 636)
- **Username**: Your domain username (domain\username or user@domain.com)
- **Password**: Your password
- **Use TLS/SSL**: Check if using LDAPS

Click **"Connect"** to establish the connection.

### 3. Test Connection
After connecting, test the connection to ensure it's working properly. Click **"Test Connection"** and verify the results.

### 4. Select Diagram Types
Choose which diagrams you want to generate:
- Forest Structure
- Site Topology
- Domain Controller Placement
- Replication Topology
- Trust Relationships

You can select multiple diagram types or use **"Select All Diagrams"** to generate all at once.

### 5. View and Export Diagrams
Once generated, you can:
- View interactive diagrams
- Zoom and pan to explore
- Export individual diagrams in multiple formats:
  - **PNG** - Raster image format
  - **PDF** - Vector format for documents
  - **SVG** - Scalable vector format
  - **Visio** - Microsoft Visio compatible format

## Project Structure

```
ADDraw/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── CredentialsForm.jsx
│   │   │   └── ConnectionTest.jsx
│   │   ├── diagrams/          # Diagram visualization components
│   │   │   ├── ForestDiagram.jsx
│   │   │   ├── SiteTopologyDiagram.jsx
│   │   │   ├── DCPlacementDiagram.jsx
│   │   │   ├── ReplicationDiagram.jsx
│   │   │   ├── TrustDiagram.jsx
│   │   │   └── DiagramContainer.jsx
│   │   ├── selection/         # Diagram selection components
│   │   │   ├── DiagramSelector.jsx
│   │   │   └── DiagramTypeCard.jsx
│   │   ├── export/            # Export functionality
│   │   │   ├── ExportManager.jsx
│   │   │   └── ExportButton.jsx
│   │   └── common/            # Common UI components
│   │       ├── LoadingSpinner.jsx
│   │       └── ErrorDisplay.jsx
│   ├── services/              # Business logic services
│   │   ├── ldapService.js     # LDAP connection handling
│   │   ├── adQueryService.js  # AD data querying
│   │   └── exportService.js   # Export functionality
│   ├── utils/                 # Utility functions
│   │   ├── diagramLayout.js   # Layout algorithms
│   │   └── formatters.js      # Data formatters
│   ├── hooks/                 # Custom React hooks
│   │   ├── useADConnection.js
│   │   └── useDiagramData.js
│   ├── App.jsx                # Main application component
│   ├── App.css                # Application styles
│   ├── index.jsx              # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Project dependencies
└── README.md                 # This file
```

## Technology Stack

- **React 18.x** - UI framework
- **Vite** - Build tool and dev server
- **Cytoscape.js** - Graph visualization library
- **jsPDF 4.x** - PDF generation
- **html2canvas** - Canvas-based rendering
- **ldapjs** - LDAP client (with browser limitations)

## Important Notes

### Browser Limitations
Due to browser security restrictions, direct LDAP queries from the browser are limited. This implementation includes:
- Mock data for demonstration purposes
- Structure ready for integration with a backend bridge

### For Production Use
Consider implementing one of the following:
1. **Electron Wrapper** - Package the app as an Electron application
2. **Node.js Bridge** - Create a lightweight local Node.js server for AD queries
3. **PowerShell Integration** - Use PowerShell AD cmdlets via a local service

### Security

- ✅ Credentials are stored only in session memory
- ✅ No data is persisted to disk
- ✅ Credentials are cleared when the session ends
- ✅ Local deployment recommended
- ⚠️ Do not deploy to public internet without proper security measures

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Adding New Diagram Types

1. Create a new diagram component in `src/components/diagrams/`
2. Add the diagram type to `DIAGRAM_TYPES` in `DiagramSelector.jsx`
3. Add a query method in `adQueryService.js`
4. Update the `App.jsx` to handle the new diagram type

## Troubleshooting

### Connection Issues
- Verify the server address is correct
- Check that the LDAP port is accessible
- Ensure credentials are valid
- Try using IP address instead of hostname

### No Diagrams Generated
- Check browser console for errors
- Verify the connection test succeeded
- Ensure selected diagram types have available data

### Export Not Working
- Check browser console for errors
- Ensure the diagram is fully rendered before exporting
- Try a different export format

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari (Limited support)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub: https://github.com/revul93/ADDraw/issues
- Check existing documentation and troubleshooting guide

## Roadmap

- [ ] Backend bridge for real LDAP queries
- [ ] More diagram customization options
- [ ] Advanced filtering and search
- [ ] Diagram comparison features
- [ ] Multi-forest support
- [ ] Dark mode
- [ ] Additional export formats

## Acknowledgments

- React team for the amazing framework
- Cytoscape.js for graph visualization
- The open-source community

---

**Built with ❤️ for Active Directory administrators**
