# Crystal Legacy — Official Google Doc digest

**Purpose:** durable local digest ของ official Crystal Legacy Google Doc — ให้ Notion/hub อยู่ lean ขณะรายละเอียดครบใน repo  
**Date:** 2026-08-11  
**Audience:** play notes / hub sync / `[Legacy ต่าง]` cross-check

## Meta

- **Doc:** https://docs.google.com/document/d/1Zku4s049Sri266zr4BhF-riqecOOHjytfZPbQULmcYk/edit  
- **README** ของ repo ชี้ไป Doc นี้ (`Full doc:` ใน `README.md`) `[Doc]`
- **Raw export:** `.superpowers/sdd/crystal-legacy-gdoc-raw.txt` (~60KB, 5723 lines) — export date **2026-08-11**
- **Warning:** ตาราง evolution / sprites / บาง gift species ใน txt export พัง (ชื่อหาย / เป็น image) — สำหรับ movepool / evo species เต็ม ๆ ใช้ **Doc UI** หรือ **Google Sheets** (`Crystal Legacy Data - Google Sheets` ใน Doc ~L2703) ดีกว่า txt `[Doc]`

---

## Doc TOC (major sections ≈ raw line)

| # | Section | ≈L |
|---|---|---|
| 1 | Intro / purpose (TSP polish/balance Crystal; retain Gen 2 feel) | ~1 |
| 2 | Stat Changes — BST buffs / redistributes | ~26 |
| 3 | Move Changes | ~637 |
| 4 | Evolution Changes | ~1478 |
| 5 | Locations — Gift & Static Pokémon | ~1566 |
| 6 | In-Depth Wild Encounters | ~1710 |
| 7 | Learnsets and TMs (+ Sheets link) | ~2696 |
| 8 | Mart & Item Changes | ~2716 |
| 9 | Assorted Changes / QoL | ~3220 |
| 10 | Trainers — Rocket / Rival / Johto Gyms / E4 / Kanto | ~3335+ |
| 11 | Credits | ~5659 |

---

## Assorted Changes / QoL — FULL list `[Doc]`

จาก Doc ~L3226–3245 (ความหมายตรงต้นฉบับ):

- Ghost type → **Special**; Dark type → **Physical**
- Faster Nurse Joy healing
- Running Shoes (**B**); works while Surfing
- Berry Shop in Goldenrod
- Ruins of Alph rework → player gets **Fossils**
- Celebi event
- Cianwood, Mahogany, & Blackthorn marts (expanded / reworked)
- HMs now deletable
- Goldenrod Move Tutor: available after **7th gym**, **daily**, costs **1000 Coins** (was post-E4 / higher cost in vanilla)
- Pokémon sprites in-game
- TM names now visible
- **Hard Mode:** no non-held bag items in battle + force **Set**; **Hardcore:** same + cannot revive
- HMs more commonly learned
- Repel re-use prompt
- New menu sprites
- Weather icons in battle
- Trainers **Smith, Craig, and Weebra** want to battle — “Go find them!”
- Fight playtesters at the **Battle Tower**; upgraded rewards (tiers below)

### Battle Tower reward tiers `[Doc]` (~L3259–3331)

Player gets **1 of 6** listed items at random after beating all **7** battles on that tier.

| Tier | Key / notable rewards (full 6-item rows in Doc) |
|---|---|
| 1 | Thick Club, Brightpowder, Pikachu Poster, SNES, Tropic Plant, Silver Trophy |
| 2 | Focus Band, PP Up, Clefairy Poster, NES, Diglett Doll, Green Carpet |
| 3 | King’s Rock, Metal Coat, Machop Doll, Polkadot Bed, Shellder Doll, Magikarp Doll |
| 4 | Scope Lens, Quick Claw, Geodude/Weedle/Grimer Dolls, Megna Plant |
| 5 | Light Ball, Stick, Staryu/Oddish/Voltorb/Poliwag Dolls |
| 6 | Fast Ball, Leftovers, Jigglypuff Doll, Pink Bed, Unown Doll, Red Carpet |
| 7 | Rare Candy, Lucky Egg, Jigglypuff Poster, Squirtle/Bulbasaur Dolls, Blue Carpet |
| 8–10 | Safari Ball, PP Max, Sacred Ash, Lucky Punch, Master Ball, Berserk Gene, more dolls/furniture/Gold Trophy — ดู Doc |

**[Repo check]** Playtesters **Smith / Craig / Weebra** = ทีมสู้หลักอยู่ **Viridian Trainer House B1F** ใน build นี้ (`maps/TrainerHouseB1F.asm`) — **ไม่ใช่** Battle Tower main fights. Doc wording คลุมเครือ (“find them” + “Fight playtesters at the Battle Tower”). BT มีชื่อ/classes แยก (`data/battle_tower/classes.asm`). เก็บทั้งสอง note.

---

## Gift & Static Pokémon `[Doc]`

ชื่อ species เติมจาก Crystal Legacy context เพราะตารางชื่อใน txt export พัง:

| Species | How / where | Notes |
|---|---|---|
| Johto starters | New Bark / Elm Lab | Lv5 + Berry |
| Togepi | Violet Center (Aide egg) | Egg → Lv5 |
| Odd Egg | Day Care Man (R34) | 1 of 7; ↑ shiny odds; knows Dizzy Punch; Lv5 |
| Abra / Porygon / Dratini | Goldenrod Game Corner | 100 / 800 / 1500 coins; Abra5, Porygon15, Dratini15; need Coin Case |
| Spearow | Randy @ R35 gate → deliver R31 | Lv15 + Mail → **TM50 Nightmare** |
| Sudowoodo | R36 weird tree | Squirtbottle; forced; Lv20 |
| Eevee | Bill’s House (after Bill @ Ecruteak Center) | Lv20 |
| Raikou / Entei | Roam Johto after Burned Tower | Lv40; **no longer have Roar** |
| Kabuto / Omanyte / Aerodactyl | Ruins of Alph fossils → Research Center | Kabuto15 (≥Gym3), Omanyte20 (≥Gym4), Aerodactyl25 (≥Gym7) |
| Tyrogue | Mt. Mortar (Kiyo) | Lv10; ~Gym4; **no Waterfall required** |
| Lapras | Union Cave B2F | Friday only; Lv20 |
| Shuckle | Mania’s House, Cianwood | Lv15 + Berry Juice (intended return) |
| Electrode | Rocket HQ | Trap floor B1F Lv21 (can’t run); ×3 generators B2F Lv23 |
| Suicune | Tin Tower lowest | After Clear Bell (post Radio Tower); Lv40 |
| Celebi | Ilex Forest shrine | After GS Ball + Kurt decipher; **≥Gym7**; Lv30 |
| Dratini | Dragon’s Den Master | Quiz; perfect answers → ExtremeSpeed; Lv15 |
| Snorlax | Vermilion | EXPN + Poké Flute channel; Lv50 |
| Lugia | Whirl Islands deepest | Silver Wing (Pewter); Lv60 |
| Ho-Oh | Tin Tower top | Rainbow Wing after beasts + HoF; Lv60 |
| Zapdos | Outside Power Plant | After Lance + fix plant; Lv60 |
| Moltres | Victory Road | After Blaine; Lv60 |
| Articuno | Seafoam | After Blue; Lv60 |
| Mewtwo | Mt. Silver | After Red; Lv75 |
| Mew | R24 Nugget Bridge | Diploma (Celadon GF) + **250** dex |

---

## Evolution Changes `[Doc]` (~L1478)

- **Newly acquired level-up evolution methods** — species เป็น table/image ใน Doc (txt ว่าง); ชี้ Doc UI
- **Trade-item evolutions now work like Evolution Stones:** Upgrade, King’s Rock×2, Metal Coat×2, Brick Piece, Dragon Scale
- **Early evolutions** (level thresholds ใน Doc table): **LV21 (−1)**, **LV25 (−6)**, **LV28 (−5)**, **LV27 (−11)** — species ดู Doc table

---

## Stat Changes summary `[Doc]` (~L26)

BST deltas จาก Doc/export (full per-stat table = Doc หรือ raw L26–636):

| Species | BST Δ | Species | BST Δ |
|---|---|---|---|
| Ekans | +15 | Arbok | +22 |
| Pikachu | +20 | Clefable | +10 |
| Vulpix | +37 | Ninetales | +10 |
| Wigglytuff | +25 | Oddish | +5 |
| Gloom | +10 | Vileplume | +25 |
| Venomoth | +25 | Dugtrio | +10 |
| Ponyta | +10 | Rapidash | +10 |
| Shellder | +5 | Marowak | +5 |
| Hitmonlee | +5 | Hitmonchan | +5 |
| Weezing | +10 | Lickitung | +55 |
| Furret | +10 | Ledian | +20 |
| Ariados | +60 | Togetic | +40 |
| Bellossom | +25 | Azumarill | +20 |
| Sudowoodo | +30 | Yanma | +60 |
| Aipom | +60 | Quagsire | +20 |
| Sunflora | +20 | Murkrow | +45 |
| Misdreavus | +25 | Gligar | +20 |
| Qwilfish | +50 | Sneasel | +35 |
| Slugma | +80 | Magcargo | +60 |
| Swinub | +90 | Piloswine | +30 |
| Corsola | +50 | Delibird | +70 |
| Mantine | +10 | Hitmontop | +5 |

**Listed / redistribute (BST Δ ไม่ติดข้าง BST ใน export):** Dewgong (475; ATK−10 / SpA+10), Magmar (495; HP+10 / ATK−10), Flareon (525; SpA+15 / SpD−15), Entei (580; ATK−25 / SpA+25). `[Doc]`

---

## Wild encounter highlights `[Doc]`

High-value Legacy diffs จาก “Notable Additions & Changes”:

- **Dark Cave:** Larvitar added (R31 side noted)
- **Union Cave:** Cubone (1F); Marill (B1F); Diglett + Kangaskhan (B2F)
- **R34:** Mankey (morn/day), Grimer
- **R35:** Yanma more common; **Growlithe at night**
- **National Park:** Scyther; Murkrow night
- **Burned Tower:** Slugma + Houndour (1F); Magmar + Misdreavus (B1F)
- **R42:** Gligar
- **Mt. Mortar:** Cubone + Rhyhorn (1F areas)
- **R43:** Flaaffy, Girafarig, Skarmory
- **Ice Path:** Sneasel all day (more common)
- **R45:** Ursaring (morn/day)
- **R27:** Johto starters Lv5 by time (Chikorita morn / Cyndaquil day / Totodile night)
- **R26:** Kanto starters Lv5 by time (Bulbasaur morn / Charmander day / Squirtle night)
- **Victory Road:** Golem, Donphan, Steelix **1%**
- **Mt. Silver:** rework; wilds **~+20 levels** (exceptions: Larvitar; some surf)

---

## Move Changes / Learnsets `[Doc]`

- Move power/acc/effect/PP table เริ่ม ~L637 — **อย่า invent move numbers**; อ่าน Doc หรือ raw
- In-game: learnsets/TMs ใน Pokédex move screen
- External: Doc text **“Crystal Legacy Data - Google Sheets”** (Move data + TM/HM learnsets v1.3); also mentions “Eddie1995 Pokemon Information Searcher”
- Repo: `data/pokemon/evos_attacks.asm`, TM lists ตาม pret layout

---

## Marts `[Doc]` + `[Repo check]`

Doc table ~L2716+ (Cherrygrove → Indigo + items). Highlights:

- **Cianwood:** evo stones (Water/Fire/Leaf/Thunder/Sun/Moon) + herb shop style items
- **Mahogany:** Pre-Rocket vs **Post-Rocket** (Metal Coat, Upgrade, Brick Piece + TMs) — **[Repo check]** post inventory unlock หลังเคลียร์ฐาน Rocket ที่ Mahogany (`MartMahogany2`), ไม่ใช่หลัง Radio Tower
- **Blackthorn:** Max Repel / Ultra Ball + TMs (Sludge Bomb, Steel Wing, Thief, …)
- **Berry shop** Goldenrod Flower Shop — `[Repo check]` `maps/GoldenrodFlowerShop.asm`
- รายละเอียดเต็ม: Doc + `data/items/marts.asm`

---

## Trainers `[Doc]`

- Doc มีตารางเต็ม Rocket (incl. Eto), Rival, Johto Gyms, E4, Kanto bosses — **ใหญ่เกิน digest**; ชี้ Doc ~L3335+ และ repo `data/trainers/parties.asm`
- **[Repo check]** badge-scaled **Chuck / Jasmine / Pryce** มีใน repo (`maps/*Gym.asm` / parties) — verify ระดับจาก badge **ก่อนสู้**

---

## Conflicts / caveats

- **[Repo check]** Smith/Craig/Weebra: Doc พูด BT; build นี้ทีมหลัก = **Viridian Trainer House B1F** (ดู Assorted)
- **[Repo check]** Mahogany Post-Rocket mart trigger ≠ Radio Tower clear
- Doc tables (evo species names, gift species column, some sprites) **export พัง** — อย่า trust txt สำหรับชื่อที่ว่าง
- Movepools / exact move numbers: Doc UI หรือ Sheets เท่านั้น — digest นี้ไม่ copy ทั้งตาราง
- Battle Tower tiers 8–10 มีใน Doc; Notion อาจสรุปแค่ key items — full list อยู่ Doc/raw
- Wild % / exact slots: Doc “In-Depth” + `data/wild/*.asm` — digest = highlights เท่านั้น

---

## Sources

- Official Doc + `.superpowers/sdd/crystal-legacy-gdoc-raw.txt` (2026-08-11)
- Prior repo audits: `notion-audit-full-2026-08-11.md`, `notion-johto-walkthrough-audit-2026-08-11.md`
