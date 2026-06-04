def test_home_page_returns_200(client):
    response = client.get("/")
    assert response.status_code == 200


def test_home_page_has_title(client):
    response = client.get("/")
    assert b"Ting Lab" in response.data


def test_home_page_has_hero_text(client):
    response = client.get("/")
    assert b"Stay" in response.data
    assert b"curious" in response.data
    assert b"Build fast" in response.data
    assert b"Learn faster" in response.data


def test_home_page_has_cta(client):
    response = client.get("/")
    assert b"Explore my world" in response.data


def test_home_page_has_tagline(client):
    response = client.get("/")
    assert b"PRODUCT" in response.data
    assert b"AI WORKFLOW" in response.data


def test_404_page(client):
    response = client.get("/nonexistent-route")
    assert response.status_code == 404
    assert b"Page not found" in response.data


def test_home_uses_template_inheritance(client):
    response = client.get("/")
    assert b"hero-text" in response.data
    assert b"header" in response.data


def test_static_css_served(client):
    response = client.get("/static/css/main.css")
    assert response.status_code == 200
    assert b"frame-1" not in response.data  # old Figma class, not in our CSS


def test_static_js_served(client):
    response = client.get("/static/js/main.js")
    assert response.status_code == 200
