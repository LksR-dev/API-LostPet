const API_BASE_URL = "localhost:3000";

export const state = {
  data: {
    fullName: null,
    email: null,
    password: null,
    bio: null,
    URI: null,
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setName(fullName: string) {
    const cs = this.getState();
    cs.fullName = fullName;
    this.setState(cs);
  },
  setEmail(email: string) {
    const cs = this.getState();
    cs.email = email;
    this.setState(cs);
  },
  setPassword(password: string) {
    const cs = this.getState();
    cs.password = password;
    this.setState(cs);
  },
  setDescription(bio: string) {
    const cs = this.getState();
    cs.bio = bio;
    this.setState(cs);
  },
  setURI(URI: string) {
    const cs = this.getState();
    cs.URI = URI;
    this.setState(cs);
  },

  async createUser() {
    const cs = this.getState();
    fetch(`${API_BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: cs.fullName,
        bio: cs.bio,
        email: cs.email,
        image: cs.URI,
        password: cs.password,
      }),
    });
  },

  setState(newState) {
    this.data = newState;
    console.log(this.data.URI);

    for (const cb of this.listeners) {
      cb();
    }
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};
