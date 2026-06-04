import os


class Config:
    """Base configuration."""

    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-prod")
    DEBUG = False
    TESTING = False


class DevConfig(Config):
    """Development configuration."""

    DEBUG = True


class ProdConfig(Config):
    """Production configuration."""

    @property
    def SECRET_KEY(self):
        key = os.environ.get("SECRET_KEY")
        if not key:
            raise RuntimeError("SECRET_KEY environment variable is required in production")
        return key


class TestConfig(Config):
    """Testing configuration."""

    TESTING = True
    DEBUG = True
