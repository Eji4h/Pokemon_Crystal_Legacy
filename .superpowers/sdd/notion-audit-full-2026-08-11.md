# Notion full audit — 2026-08-11

Hub: `3b7da311-a58e-80c2-b287-de7ce0dc63fd`  
Map: `3b8da311-a58e-819f-b27c-eb97dbaca47b`  
Johto: `3b8da311-a58e-811f-92dd-cdb621adacd4`

Scope: **ทั้ง hub + Johto + แผนที่** (ไม่ใช่แค่ Dark Cave)

## Fixed this pass

| Change | Evidence |
|---|---|
| ลบ Goal callout ซ้ำ (Azalea + Flash) | trash `3b8da311-a58e-8102-a563-e4fd7b915506` — เหลืออันเดียว |
| ลบย่อหน้า orphan ผิดเรื่อง “ต้นฉบับสากลไม่มีเควสนี้” | trash `5afcd360-…` (วางผิดที่ / ข้อความหลอก) |
| แก้ level scaling: Badge **ก่อนสู้** = 4/5/6 ไม่ใช่ 5/6/7 | `maps/CianwoodGym.asm` / `OlivineGym.asm` / `MahoganyGym.asm` |
| แก้ Roar claim: ตัดจาก **level-up** ใน `evos_attacks.asm` (ยัง TM05 ได้) | `data/pokemon/evos_attacks.asm` Raikou/Entei |
| แก้ wild/Bug Contest: Park มี Scyther; Contest ยัง 5% Scyther/Pinsir | `johto_grass.asm` / `bug_contest_mons.asm` |
| แก้ playtester: ทีมหลัก = Viridian Trainer House (Smith/Craig/Weebra); BT names แยก | `maps/TrainerHouseB1F.asm` (+ `battle_tower/classes.asm` เป็นคนละชุด) |
| แก้ Mahogany Mart: หลังเคลียร์ฐาน Rocket ที่ Mahogany ไม่ใช่ Radio Tower | `maps/MahoganyMart1F.asm` Granny → `MartMahogany2` |
| เติม AlwaysFlee + Jasmine ทีม1=ทีม2 ใน scaling/beasts | `flee_mons.asm`; `parties.asm` Jasmine |
| ใส่หัว callout ร้าน Legacy ที่ว่าง | `7ea0b45d-…` |
| แก้ “ซื้อ X Item ไม่ได้แล้ว” → ยังมีใน marts | `MartGoldenrod3F` ฯลฯ ใน `marts.asm` |
| อธิบาย HM forget ด้วย cite `learn.asm` | `; jr c, .hmmove` ถูกคอมเมนต์ (ทำแล้วใน Notion) |

## Claim verdicts (Legacy)

| Claim | Verdict |
|---|---|
| Bugsy = Pineco / Ledian / Scyther ace | **VERIFIED** `parties.asm` |
| Move Tutor: หลังยิม 7, daily, 1000 coins (vanilla 4000 post-E4 Wed/Sat) | **VERIFIED** `GoldenrodCity.asm` |
| Ghost=Special / Dark=Physical | **VERIFIED** (prior) `effect_commands.asm` |
| Raikou/Entei roam after Burned Tower; no Roar on level-up | **VERIFIED** |
| Level scaling Chuck/Jasmine/Pryce | **VERIFIED** (wording fixed) |
| Cianwood Pharmacy evo stones | **VERIFIED** `MartCianwood` |
| Battle Tower playtester names | **PARTIAL** — มีชื่อใน `classes.asm` แต่ทีมสู้หลักอยู่ Viridian Trainer House |
| Playtester near Day Care / รางวัล BT | **WRONG → fixed** → Viridian B1F Smith/Craig/Weebra |
| GS Ball → Kurt ต้อง ≥7 badges | **VERIFIED** `KurtsHouse.asm` |
| Mahogany2 Metal Coat + Upgrade | **VERIFIED** `MartMahogany2` |
| Flower Shop sells berries | **VERIFIED** `GoldenrodFlowerShop.asm` |
| Can forget HM when learning new move | **VERIFIED** `learn.asm` commented gate |
| “ซื้อ X Item ไม่ได้แล้ว” | **WRONG → fixed** |
| GS Ball เป็นเควสเฉพาะ Legacy / ต้นฉบับสากลไม่มี | **WRONG orphan → deleted** (Crystal international มี GS Ball) |

## Map page (prior + still true)

- Primary: pokemoncompletion Crystal  
- Dark Cave items/warps: verified vs Violet/Blackthorn entrance asm  
- Other dungeons: pointer-only, **ยังไม่มีรายการ item/warp จาก asm**

## Still open / not deep-audited

1. **Johto walkthrough ทีละเมือง** (trainer levels, event order, Ice Path steps) — อ่านโครงครบแต่ยังไม่เทียบทีละ bullet กับ asm  
2. **Hub บริการ** Haircut / Buena / Week Siblings / Bill Eevee / Swarm rates — โครงดูสมเหตุผล; swarm % ยังไม่ไล่ทุกตัวจาก phone scripts  
3. **Post-game Kanto** เรือ / Metal Coat / gyms / Mt. Silver — โครง OK; ยังไม่ไล่ทีละจุด  
4. **Ruins of Alph fossils** ในร้าน Legacy list — ยังไม่เปิด map/event ยืนยันรอบนี้  
5. **Mahogany/Blackthorn/Celadon TM inventories** — มี TM ใน marts; ยังไม่เทียบรายชื่อครบกับ vanilla  
6. Child pages ยังโผล่ท้าย body; Post-game แยก 2× H1 (รวมใน UI ได้ถ้าต้องการ)

## Sources

- Repo: `data/trainers/parties.asm`, `maps/*Gym.asm`, `maps/GoldenrodCity.asm`, `maps/KurtsHouse.asm`, `data/items/marts.asm`, `data/pokemon/evos_attacks.asm`, `data/wild/*`, `data/battle_tower/classes.asm`, `engine/pokemon/learn.asm`  
- Prior map audit: `.superpowers/sdd/notion-audit-2026-08-11.md`
