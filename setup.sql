-- Make sure to have a db called whatever you set DATABASE_NAME to
-- Create the users table
CREATE TABLE IF NOT EXISTS app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert the admin user if it doesn't already exist
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2a$12$1SoHD/cCD9a4Zyxdr1kx3u3AGDD1HKqOsph3KVI42Uo8A/U9DaN62', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
