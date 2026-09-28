const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");

// Supposons que ton serveur est exporté ou importé, ou bien tu peux le tester directement via des requêtes HTTP si le serveur écoute sur un port de test.
// Voici un exemple en testant l'application en démarrant le serveur sur un port aléatoire ou fixe pour le test :

test("GET /version returns service and version", async () => {
  const PORT = 8081;
  const APP_NAME = "platform-demo";

  // Création d'une instance rapide du serveur pour le test
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/version") {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          service: APP_NAME,
          version: "1.0.0",
        }),
      );
      return;
    }
    res.writeHead(404);
    res.end(JSON.stringify({ error: "not found" }));
  });

  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    const response = await fetch(`http://localhost:${PORT}/version`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(data, {
      service: "platform-demo",
      version: "1.0.0",
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
