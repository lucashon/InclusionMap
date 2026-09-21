// Modal, auth and navigation
const AUTH_KEY = 'inclusionAuth'

const modal = document.getElementById('modal')
const btn = document.getElementById('btn')
const close = document.getElementById('close')

const modalLogin = document.getElementById('modalLogin')
const closeLogin = document.getElementById('closeLogin')
const formLogin = document.getElementById('formLogin')
const userTypeInput = document.getElementById('userType')
const redirectToInput = document.getElementById('redirectTo')
const modalLoginTitle = document.getElementById('modalLoginTitle')
const modalLoginHint = document.getElementById('modalLoginHint')
const loginError = document.getElementById('loginError')

const LOGIN_LABELS = {
    prefeitura: { title: 'Acesso Prefeitura', hint: 'Entre para acessar o painel da prefeitura.' },
    cidadao: { title: 'Acesso Cidadão', hint: 'Entre para acessar a área do cidadão.' },
    geral: { title: 'Entrar na Conta', hint: '' }
}

function openOverlay(el) {
    if (!el) return
    el.style.display = 'flex'
    el.setAttribute('aria-hidden', 'false')
}
function closeOverlay(el) {
    if (!el) return
    el.style.display = 'none'
    el.setAttribute('aria-hidden', 'true')
}

function getAuth() {
    try {
        const raw = localStorage.getItem(AUTH_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

function setAuth(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data))
}

function clearAuth() {
    localStorage.removeItem(AUTH_KEY)
}

function isAuthenticated() {
    const auth = getAuth()
    return !!(auth && auth.userId)
}

function updateAuthUI() {
    const logged = isAuthenticated()
    const auth = getAuth()
    const perfilHref = auth?.userId ? `/inclusion/login/${auth.userId}` : '#'

    const btnLogin = document.getElementById('btnLogin')
    const btnLoginMobile = document.getElementById('btnLoginMobile')
    const authDesktop = document.getElementById('authLoggedDesktop')
    const authMobile = document.getElementById('authLoggedMobile')
    const btnPerfil = document.getElementById('btnMeuPerfil')
    const btnPerfilMobile = document.getElementById('btnMeuPerfilMobile')

    if (btnLogin) btnLogin.classList.toggle('d-none', logged)
    if (btnLoginMobile) btnLoginMobile.classList.toggle('d-none', logged)
    if (authDesktop) authDesktop.classList.toggle('d-none', !logged)
    if (authMobile) authMobile.classList.toggle('d-none', !logged)
    if (btnPerfil) btnPerfil.href = perfilHref
    if (btnPerfilMobile) btnPerfilMobile.href = perfilHref
}

function openLoginModal(userType = 'geral', redirectTo = '') {
    if (!modalLogin) return
    const type = LOGIN_LABELS[userType] ? userType : 'geral'
    if (userTypeInput) userTypeInput.value = type
    if (redirectToInput) redirectToInput.value = redirectTo || ''
    if (modalLoginTitle) modalLoginTitle.textContent = LOGIN_LABELS[type].title
    if (modalLoginHint) {
        const hint = LOGIN_LABELS[type].hint
        modalLoginHint.textContent = hint
        modalLoginHint.hidden = !hint
    }
    if (loginError) {
        loginError.hidden = true
        loginError.textContent = ''
    }
    openOverlay(modalLogin)
}

async function logout() {
    try {
        await fetch('/inclusion/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: { Accept: 'application/json' }
        })
    } catch (_) { /* ignore network errors on logout */ }
    clearAuth()
    updateAuthUI()
    window.location.href = '/'
}

// Cadastro modal
if (btn && modal) btn.addEventListener('click', () => openOverlay(modal))
const btnCta = document.getElementById('btnCta')
if (btnCta && modal) btnCta.addEventListener('click', () => openOverlay(modal))
if (close && modal) close.addEventListener('click', () => closeOverlay(modal))

const hamburger = document.getElementById('hamburger')
const navMobile = document.getElementById('navMobile')

document.querySelectorAll('.js-open-login').forEach((el) => {
    el.addEventListener('click', () => {
        openLoginModal(el.dataset.userType || 'geral', el.dataset.redirect || '')
        if (navMobile && navMobile.style.display === 'flex') {
            navMobile.style.display = 'none'
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false')
        }
    })
})

if (closeLogin && modalLogin) {
    closeLogin.addEventListener('click', () => closeOverlay(modalLogin))
}

if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
        const isOpen = navMobile.style.display === 'flex'
        navMobile.style.display = isOpen ? 'none' : 'flex'
        hamburger.setAttribute('aria-expanded', String(!isOpen))
    })
}

document.getElementById('btnLogout')?.addEventListener('click', logout)
document.getElementById('btnLogoutMobile')?.addEventListener('click', logout)

// Login via fetch → /inclusion/auth/login
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault()
        if (loginError) {
            loginError.hidden = true
            loginError.textContent = ''
        }

        const email = formLogin.email?.value?.trim()
        const senha = formLogin.senha?.value
        const userType = userTypeInput?.value || 'geral'
        const redirectTo = redirectToInput?.value || ''

        const body = new URLSearchParams()
        body.set('email', email)
        body.set('emailLogin', email) // compatível com backend legado
        body.set('senha', senha)
        body.set('userType', userType)
        if (redirectTo) body.set('redirectTo', redirectTo)

        const submitBtn = document.getElementById('submit-entrar')
        if (submitBtn) submitBtn.disabled = true

        try {
            const res = await fetch('/inclusion/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json'
                },
                body
            })

            const data = await res.json().catch(() => null)

            if (!res.ok || !data?.ok) {
                if (loginError) {
                    loginError.textContent = data?.message || 'Falha no login. Verifique email e senha.'
                    loginError.hidden = false
                }
                return
            }

            setAuth({
                userId: data.userId,
                userType: data.userType || userType,
                token: String(data.userId)
            })
            updateAuthUI()
            closeOverlay(modalLogin)
            window.location.href = data.redirect || `/inclusion/login/${data.userId}`
        } catch (_) {
            if (loginError) {
                loginError.textContent = 'Erro de conexão. Tente novamente.'
                loginError.hidden = false
            }
        } finally {
            if (submitBtn) submitBtn.disabled = false
        }
    })
}

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        if (modal && modal.style.display === 'flex') closeOverlay(modal)
        if (modalLogin && modalLogin.style.display === 'flex') closeOverlay(modalLogin)
        if (navMobile && navMobile.style.display === 'flex') {
            navMobile.style.display = 'none'
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false')
        }
    }
})

updateAuthUI()

/* ─── Quem somos carousel ─── */
// Carrossel configurado temporariamente com a mesma imagem
const imagesMock = [
    { src: '/assets/imagem3.jpg', alt: 'Inclusion Map — Slide 1' },
    { src: '/assets/imagem3.jpg', alt: 'Inclusion Map — Slide 2' },
    { src: '/assets/imagem3.jpg', alt: 'Inclusion Map — Slide 3' }
]

function initCarousel() {
    const track = document.getElementById('carouselTrack')
    const dotsWrap = document.getElementById('carouselDots')
    const prev = document.getElementById('carouselPrev')
    const next = document.getElementById('carouselNext')
    if (!track || !dotsWrap || !imagesMock.length) return

    let index = 0
    let timer

    track.innerHTML = imagesMock.map((img) =>
        `<div class="carousel__slide"><img src="${img.src}" alt="${img.alt}" loading="lazy"></div>`
    ).join('')

    dotsWrap.innerHTML = imagesMock.map((_, i) =>
        `<button type="button" class="carousel__dot${i === 0 ? ' is-active' : ''}" role="tab" aria-label="Ir para slide ${i + 1}" data-index="${i}"></button>`
    ).join('')

    const dots = () => [...dotsWrap.querySelectorAll('.carousel__dot')]

    function goTo(i) {
        index = (i + imagesMock.length) % imagesMock.length
        track.style.transform = `translateX(-${index * 100}%)`
        dots().forEach((d, di) => d.classList.toggle('is-active', di === index))
    }

    function startAuto() {
        stopAuto()
        timer = setInterval(() => goTo(index + 1), 5000)
    }
    function stopAuto() {
        if (timer) clearInterval(timer)
    }

    if (prev) prev.addEventListener('click', () => { goTo(index - 1); startAuto() })
    if (next) next.addEventListener('click', () => { goTo(index + 1); startAuto() })
    dotsWrap.addEventListener('click', (e) => {
        const dot = e.target.closest('.carousel__dot')
        if (!dot) return
        goTo(Number(dot.dataset.index))
        startAuto()
    })

    const root = document.getElementById('quemSomosCarousel')
    if (root) {
        root.addEventListener('mouseenter', stopAuto)
        root.addEventListener('mouseleave', startAuto)
    }

    goTo(0)
    startAuto()
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel)
} else {
    initCarousel()
}
