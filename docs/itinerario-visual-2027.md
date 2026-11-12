# Itinerario Japón 2027 · vista visual

> Plan vigente a 12 nov 2026. Fuente de detalle y justificaciones: [revision-itinerario-fechas-2027.md](revision-itinerario-fechas-2027.md).
> Vuelos: **vie 7 may** BCN 10:15 → **sáb 8 may** NRT 09:30 · **vie 28 may** NRT 11:20 → BCN 23:05.

---

## 1. La ruta: ciudades base, noches y excursiones

Las flechas continuas son cambios de hotel (con maletas y taxi). Las discontinuas son excursiones de ida y vuelta, sin maletas.

```mermaid
flowchart LR
    NRT1(("✈️ Narita<br/>sáb 8 · 09:30"))
    TK1["🗼 TOKIO<br/>4 noches<br/>sáb 8 → mié 12"]
    TAK["♨️ TAKARAGAWA<br/>1 noche<br/>mié 12"]
    KNZ["🏯 KANAZAWA<br/>2 noches<br/>jue 13 → sáb 15"]
    TKY["🏘️ TAKAYAMA<br/>2 noches<br/>sáb 15 → lun 17"]
    KYO["⛩️ KIOTO<br/>4 noches<br/>lun 17 → vie 21"]
    OSA["🍜 OSAKA<br/>4 noches<br/>vie 21 → mar 25"]
    TK2["🗼 TOKIO<br/>3 noches<br/>mar 25 → vie 28"]
    NRT2(("✈️ Narita<br/>vie 28 · 11:20"))

    SHI["Shirakawa-go<br/>lun 17 mañana"]
    NAR["Nara<br/>vie 21 tarde"]
    KAT["Katsuo-ji<br/>sáb 22"]
    HIR["Hiroshima<br/>dom 23"]

    NRT1 --> TK1 --> TAK --> KNZ --> TKY --> KYO --> OSA --> TK2 --> NRT2
    TKY -.-> SHI
    OSA -.-> NAR
    OSA -.-> KAT
    OSA -.-> HIR
```

**Reparto de noches (20):** Tokio 4 · Takaragawa 1 · Kanazawa 2 · Takayama 2 · Kioto 4 · Osaka 4 · Tokio 3.

---

## 2. Calendario por semanas

| Semana | Lun | Mar | Mié | Jue | Vie | **Sáb** | **Dom** |
|---|---|---|---|---|---|---|---|
| **0** | | | | | ✈️ Salida BCN | 🗼 Llegada · Kanda / Asakusa noche | 🗼 Palacio · Ginza peatonal |
| **1** | 🗼 Meiji · Harajuku · Shibuya (Parco friki + Sky) · Shinjuku noche | 🗼 Museo Nacional · Tsukiji (comida) · Yanaka | ♨️ Onsen Takaragawa | 🏯 Llegada Kanazawa · Higashi Chaya | 🏯 Kenroku-en · Nagamachi · Ōmichō · tarde libre | 🏘️ Llegada Takayama · Yatai Kaikan · Sanmachi | 🏘️ Mercado · Jinya · Hida no Sato |
| **2** | 🏘️→⛩️ Shirakawa-go · tren a Kioto | ⛩️ Higashiyama sur→norte · Gion | ⛩️ Arashiyama · Sanjūsangen-dō · Nijō | ⛩️ Fushimi Inari al amanecer · Kinkaku-ji · Nishiki | ⛩️→🍜 Tō-ji (mercadillo) · maletas a Osaka · Nara tarde | 🍜 Katsuo-ji · Minami | 🍜 Hiroshima |
| **3** | 🍜 Día tranquilo · castillo de Osaka · Kuromon · Shinsekai · Umeda Sky atardecer | 🍜→🗼 Shinkansen · Akihabara friki | 🗼 Asakusa · Skytree | 🗼 Fukagawa · Nakano Broadway · maletas | ✈️ NRT 11:20 → BCN 23:05 | 🏠 Descanso | 🏠 Descanso |

---

## 3. Cronograma día a día

Cada fila es un día. Los días de cambio de hotel están marcados en rojo (`crit`).

```mermaid
gantt
    title Japón 2027 · 8 → 28 de mayo
    dateFormat YYYY-MM-DD
    axisFormat %d/%m

    section 🗼 Tokio 1
    Llegada 9·30 · Kanda Matsuri o Asakusa noche   :crit, d08, 2027-05-08, 1d
    Jardines del Este · Ginza peatonal             :d09, 2027-05-09, 1d
    Meiji · Harajuku · Shibuya Parco y Sky · Shinjuku :d10, 2027-05-10, 1d
    Museo Nacional 9·30 · Tsukiji comida · Yanaka  :d11, 2027-05-11, 1d

    section ♨️ Takaragawa
    Shinkansen · ryokan Osenkaku                   :crit, d12, 2027-05-12, 1d

    section 🏯 Kanazawa
    Lanzadera 9·30 · tren · Higashi Chaya          :crit, d13, 2027-05-13, 1d
    Kenroku-en 7·00 · castillo · Nagamachi · Ōmichō :d14, 2027-05-14, 1d

    section 🏘️ Takayama
    Bus o tren · Yatai Kaikan · Sanmachi desde 16·00 :crit, d15, 2027-05-15, 1d
    Mercado matinal · Jinya · Hida no Sato         :d16, 2027-05-16, 1d

    section ⛩️ Kioto
    Shirakawa-go 8·10 · tren a Kioto               :crit, d17, 2027-05-17, 1d
    Higashiyama sur a norte · Gion                 :d18, 2027-05-18, 1d
    Arashiyama 7·00 · Sanjūsangen-dō · Nijō tarde  :d19, 2027-05-19, 1d
    Fushimi Inari 1er tren · Kinkaku-ji 9·00 · Ryōan-ji · Nishiki :d20, 2027-05-20, 1d

    section 🍜 Osaka
    Tō-ji · maletas a Osaka · Nara tarde           :crit, d21, 2027-05-21, 1d
    Katsuo-ji · Minami                             :d22, 2027-05-22, 1d
    Excursión a Hiroshima                          :d23, 2027-05-23, 1d
    Tranquilo · castillo · Kuromon · Shinsekai · Umeda Sky :d24, 2027-05-24, 1d

    section 🗼 Tokio 2
    Shinkansen asiento E · Akihabara friki         :crit, d25, 2027-05-25, 1d
    Asakusa 7·30 · Skytree atardecer               :d26, 2027-05-26, 1d
    Kiyosumi-Fukagawa · Nakano Broadway · maletas  :d27, 2027-05-27, 1d
    Skyliner · vuelo 11·20                         :crit, d28, 2027-05-28, 1d
```

---

## 4. Por qué cada cosa va en ese día

Hay cuatro reglas, por orden de prioridad:

| Regla | Días | Motivo |
|---|---|---|
| 🟥 **Mandan los cierres y las fechas fijas** | Mar 11 · Dom 9 · Vie 21 | El Museo Nacional de Tokio cierra los lunes. Los Jardines del Este cierran lunes y viernes. Tsukiji cierra los domingos. El mercadillo de Tō-ji solo se celebra el día 21 |
| 🟩 **Laborable** para huir del turismo local | Mié 12 onsen · Lun 17 Shirakawa-go · Lun 10 Harajuku | Entre semana hay menos bañistas de día y la noche es más barata. Shirakawa-go se colapsa en domingo. Harajuku es intransitable en fin de semana |
| 🟨 **Laborable + hora extrema** para esquivar a los escolares de mayo (10–15 h) | Kioto, Nara y donde haga falta | **Primera oleada:** Fushimi Inari con el primer tren, Kiyomizu a las 6:00, Arashiyama a las 7:00, Kinkaku-ji a las 9:00 en punto, Kenroku-en a las 7:00, Asakusa a las 7:30. Tōdai-ji, a la inversa, a última hora de la tarde |
| 🟦 **Fin de semana** donde se gana algo o no se pierde nada | Dom 9 Ginza · Sáb 22 Katsuo-ji · Dom 23 Hiroshima · Sáb 15 / Dom 16 Takayama | Ginza solo es peatonal en fin de semana. Katsuo-ji tiene más autobuses. En Hiroshima no hay grupos escolares en domingo. Takayama es una ciudad que absorbe a la gente |

---

## 5. Los días de traslado de cerca

| Día | Trayecto | Cómo | Llegada aprox. |
|---|---|---|---|
| Sáb 8 | Narita → Tokio | Skyliner (~41 min a Ueno) + taxi | ~12:30 |
| Mié 12 | Tokio → Takaragawa | Jōetsu Shinkansen (~1h15) + lanzadera del ryokan a las 13:00 o 15:00 (**reservar por teléfono**) | 13:45 o 15:45 |
| Jue 13 | Takaragawa → Kanazawa | Lanzadera 9:30 (la única) → Jōmō-Kōgen → Takasaki → Hokuriku Shinkansen | ~14:00 |
| Sáb 15 | Kanazawa → Takayama | Bus Nōhi con reserva (~2h15) o tren por Toyama (solo 4 trenes Hida al día) | mediodía |
| Lun 17 | Takayama → Kioto | Shirakawa-go por la mañana, vuelta a Takayama → Hida a Nagoya + Shinkansen | ~17:00 |
| Vie 21 | Kioto → Osaka | Tō-ji (las maletas se quedan en el hotel) → recogerlas → JR a Osaka + taxi a Namba → **dejarlas en el hotel** → Nara en ida y vuelta por la tarde | ~12:30 |
| Mar 25 | Osaka → Tokio | Tōkaidō Shinkansen, **asiento E** para ver el Fuji | ~mediodía |
| Vie 28 | Tokio → Narita | Taxi → Skyliner desde Ueno/Nippori → T1 | ~8:45 |

**Pendiente de confirmar más adelante:**
- Las fechas del Kanda Matsuri, que se publican en primavera de 2027.
- Los horarios de trenes y autobuses de 2027, después del cambio de marzo.
- Los horarios de Ginkaku-ji y Nanzen-ji.
