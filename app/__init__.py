import os
from flask import Flask


def create_app(config_class: str | None = None) -> Flask:
    app = Flask(__name__)

    if config_class is None:
        config_class = os.environ.get("FLASK_CONFIG", "app.config.DevConfig")
    app.config.from_object(config_class)

    # Register blueprints
    from app.main import main_bp

    app.register_blueprint(main_bp)

    # Register error handlers
    from app.errors import register_error_handlers

    register_error_handlers(app)

    # Configure logging
    from app.logging import configure_logging

    configure_logging(app)

    return app
