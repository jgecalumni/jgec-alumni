import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JGEC Alumni Association API',
            version: '1.0.0',
            description: 'API documentation for JGEC Alumni Association backend',
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Development server',
            },
            {
                url: 'https://backend.jgecalumni.in',
                description: 'Production server',
            }
        ],
    },
    apis: [
        path.join(__dirname, '../router/*.route.{ts,js}'),
        path.join(__dirname, '../index.{ts,js}')
    ], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    const uiOptions = {
        customCss: `
            .swagger-ui .topbar { background-color: #ffffff; border-bottom: 2px solid #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .swagger-ui .topbar-wrapper .link img, 
            .swagger-ui .topbar-wrapper .link svg { 
                display: none !important; 
            }
            .swagger-ui .topbar-wrapper .link { 
                background: url('https://res.cloudinary.com/daanphoru/image/upload/v1788075752/Logo_f6moef.webp') no-repeat left center; 
                background-size: contain; 
                display: block !important; 
                height: 40px !important; 
                width: 150px !important; 
                text-decoration: none !important;
            }
        `,
        customSiteTitle: "JGEC Alumni API Docs",
        customfavIcon: "https://res.cloudinary.com/daanphoru/image/upload/v1788075752/Logo_f6moef.webp"
    };

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, uiOptions));
    console.log('📄 Swagger docs available at http://localhost:8000/api-docs');
};
