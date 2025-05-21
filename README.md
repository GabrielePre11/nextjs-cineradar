# 🎬 CineRadar

**CineRadar** è una libreria di film e serie TV sviluppata con **Next.js 15**.  
Permette agli utenti di esplorare migliaia di titoli, visualizzare i dettagli completi e salvare i preferiti in locale.

---

## 🚀 Funzionalità

- 🔍 **Esplora film e serie TV** per popolarità, valutazione o genere
- ❤️ **Aggiungi o rimuovi dai Preferiti**, salvati in locale
- 📄 **Scheda dettagliata** per ogni titolo: descrizione, data d’uscita, voto, generi e altro
- 🌐 **Design responsive**

---

## 🛠️ Tecnologie utilizzate

- **Next.js 15 (App Router)**
- **Zustand** (gestione dello stato)
- **TypeScript**
- **TMDb API** (The Movie Database)
- **Tailwind CSS**
- **React Icons**

---

## 🔍 Come funziona la ricerca?

La ricerca funziona grazie alle funzionalità di Next Navigation, come **useRouter**, **usePathname**, e **useSearchParameter**. 
-  Quando l'utente inserisce una ricerca nella barra (Searchbar), il componente utilizza il pathname (es. /movies) e il router per aggiornare l'URL con la query della ricerca (il titolo del film o della serie).
-  I componenti che mostrano i risultati leggono la query dall’URL tramite useSearchParams:
-  - Se la query è presente, viene effettuata una chiamata API per mostrare i film o le serie TV corrispondenti alla ricerca.
   - Se la query non è presente, viene mostrata la lista di film e serie TV popolari di default.
