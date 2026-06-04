import logging
import sys


def configure_logging(app):
    """Configure structured logging to stdout for container-friendly output."""
    level = logging.DEBUG if app.debug else logging.INFO
    app.logger.setLevel(level)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)

    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s [%(name)s] %(message)s [%(pathname)s:%(lineno)d]"
    )
    handler.setFormatter(formatter)

    # Remove default handlers and add ours
    for h in app.logger.handlers[:]:
        app.logger.removeHandler(h)
    app.logger.addHandler(handler)

    app.logger.info("Logging configured at %s level", logging.getLevelName(level))
