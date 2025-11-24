// ===== Supabase Auth Check =====

// Inicialize o Supabase (substitua pelos seus valores)
const supabase = window.supabase.createClient(
  "https://wxleljqxeqwaplcebfxs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bGVsanF4ZXF3YXBsY2ViZnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzgwMzIsImV4cCI6MjA3Nzc1NDAzMn0.7J2eTkojwMRh3UrFInhPoOrTgW807pOD-rnctiYJQMg"
);

// Oculta o botão de login quando o usuário está logado
async function verificarLogin() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const btn = document.querySelector("[data-login-button]");
      if (btn) {
        btn.style.display = "none";
      }
    }
  } catch (err) {
    console.error("Erro ao verificar login:", err);
  }
}

// Executa automaticamente
verificarLogin();
