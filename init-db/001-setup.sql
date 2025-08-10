-- Make sure to have a db called whatever you set DATABASE_NAME to

-- Create the users table
CREATE TABLE IF NOT EXISTS app_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert the admin user if it doesn't already exist
INSERT INTO app_user (username, password_hash, role)
VALUES ('admin', '$2a$12$1SoHD/cCD9a4Zyxdr1kx3u3AGDD1HKqOsph3KVI42Uo8A/U9DaN62', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- Create the workspace table
CREATE TABLE IF NOT EXISTS workspace (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT,
    name VARCHAR(255),
    CONSTRAINT fk_workspace_owner FOREIGN KEY (owner_id) REFERENCES app_user(id)
);

-- Create the image table
CREATE TABLE IF NOT EXISTS image (
    url TEXT PRIMARY KEY,
    workspace_id BIGINT,
    filename VARCHAR(255),
    annotations TEXT,
    CONSTRAINT fk_image_workspace FOREIGN KEY (workspace_id) REFERENCES workspace(id)
);

-- Create the workspace_user join table
CREATE TABLE IF NOT EXISTS workspace_user (
    workspace_id BIGINT NOT NULL,
    app_user_id BIGINT NOT NULL,
    PRIMARY KEY (workspace_id, app_user_id),
    CONSTRAINT fk_wu_workspace FOREIGN KEY (workspace_id) REFERENCES workspace(id),
    CONSTRAINT fk_wu_user FOREIGN KEY (app_user_id) REFERENCES app_user(id)
);
