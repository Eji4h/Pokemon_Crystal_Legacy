# Johto walkthrough audit — 2026-08-11

Page: `เดินเนื้อเรื่อง Johto` `3b8da311-a58e-811f-92dd-cdb621adacd4`  
Scope: gym-by-gym vs repo (Post-game Kanto deferred)

## Fixed in Notion this pass

| Fix | Evidence |
|---|---|
| Old Rod ไม่ได้อยู่ Union Cave → Route 32 Poké Center | `maps/Route32Pokecenter1F.asm` |
| Goal Azalea: Flash ไม่ใช่ prereq ของ Union Cave | Dark Cave เท่านั้น |
| Togepi: Violet Center หลัง Falkner | `maps/VioletPokecenter1F.asm` |
| Falkner + TM31 Mud-Slap; Legacy Pidgey/Noctowl | `VioletGym.asm` / `parties.asm` |
| Bugsy + TM49; party levels detail | `AzaleaGym.asm` / `parties.asm` |
| Whitney + TM45 Attract; Legacy Clefairy/Teddiursa/Miltank | `GoldenrodGym.asm` / `parties.asm` |
| Morty + TM30 Shadow Ball; Legacy Haunter/Stantler/Misdreavus/Gengar | `EcruteakGym.asm` / `parties.asm` |
| HM04 Strength จาก Olivine Cafe (ก่อน Chuck) | `maps/OlivineCafe.asm` |
| Pryce + TM16 Icy Wind | `MahoganyGym.asm` |
| Clair → Dragon's Den → Rising Badge + TM24 DragonBreath | `DragonShrine.asm` / `BlackthornGym1F.asm` |
| Goal Goldenrod: Cut ต้องมี Hive ด้วย (ได้ HM ก่อนยิมได้) | `engine/events/overworld.asm` Cut check |
| Farfetch'd/Cut ลำดับ: Well → Cut HM → Bugsy → ใช้ Cut | `IlexForest.asm` |
| Flash: ได้ HM ได้ก่อนยิม; ใช้ field ต้อง Zephyr | `SproutTower3F.asm` / overworld |
| Squirtbottle: Plain พอ ไม่บังคับ Floria (Legacy) | `GoldenrodFlowerShop.asm:15-21` |
| Morty เปิดหลัง Burned Tower; Tin Tower Fog vs Clear Bell | `BurnedTowerB1F.asm` / Tin Tower entrance |
| Kimono Surf: ได้ HM ก่อน Fog ได้; ใช้ field ต้อง Fog | `DanceTheatre.asm` / overworld |
| Radio Tower: Basement Key → Warehouse Card Key → Clear Bell (ไม่ใช่ Card Key จากหัวหน้า) | `RadioTower5F.asm` / `GoldenrodUndergroundWarehouse.asm` |
| Gen2: Dragon Fang ไม่บูสต์; Dragon Scale = +10% Dragon | `data/items/attributes.asm` |
| Master Ball หลัง Rising Badge (ไม่หลัง Champion) | `ElmsLab.asm:97-100` |
| Red Gyarados Lv.30 | `LakeOfRage.asm` |
| Whirl Islands: แวะหลังได้ Whirlpool (ไม่ใช่ทริปแรก Cianwood) | HM จาก `TeamRocketBaseB2F.asm` |
| E4/Lance + Clair1 levels ใส่ Notion | `data/trainers/parties.asm` |

## Verified OK (ไม่ต้องแก้)

- Sprout Tower → HM05 Flash (`SproutTower3F.asm`) — ได้ก่อน/หลังยิมได้; ใช้ Flash ต้องมี Zephyr
- Cut จาก Farfetch'd / Ilex (`IlexForest.asm`)
- Kimono Girls → HM03 Surf (`DanceTheatre.asm`)
- SecretPotion Cianwood Pharmacy → Amphy → Jasmine Mineral + TM23 Iron Tail
- Chuck Storm + TM01 DynamicPunch; Fly จากภรรยา Chuck (`CianwoodCity.asm`)
- Rocket base → HM06 Whirlpool (`TeamRocketBaseB2F.asm`)
- Ice Path: HM07 Waterfall on 1F; TM44 Rest on B2F Blackthorn side; NeverMeltIce B3F
- Dratini ExtremeSpeed via `special GiveDratini` when quiz correct
- Odd Egg จาก Day Care Man (`DayCare.asm`)
- Master Ball จาก Elm หลัง Rising Badge (ไม่หลัง Champion / before E4 path) (`ElmsLab.asm:97-100`)
- Ruins fossils revive: Dome ≥3 / Helix ≥4 / Old Amber ≥7 badges

## Still open

- Ice Path step-by-step vs `.blk` / boulder events (Legacy หินอาจต่าง — มี note แล้ว ยังไม่ tile-proof)
- Post-game Kanto — ดู `notion-kanto-postgame-audit-2026-08-11.md`

## Empty tables filled (2026-08-11)

| Table | Source |
|---|---|
| Bug Contest รางวัล | `std_scripts.asm` Sun/Ever/Gold Berry/Berry |
| สูตรคะแนน | `judging.asm` ContestScore |
| Park Ball catch % | catch rate 45 + Park=Great ×1.5 |
| NPC Nick et al. | `bug_contest_winners.asm` |
| ช่วงคะแนนผู้เล่น | ContestScore Lv.14 calc (~320–386 Scyther) |
| Suicune sightings | Burned→Cianwood→R42→R36→Tin Tower 1F |

## Gym TM cheat sheet (Legacy parties.asm + gym maps)

| Gym | Badge | TM | Legacy party highlight |
|---|---|---|---|
| Falkner | Zephyr | Mud-Slap | Pidgey + **Noctowl** |
| Bugsy | Hive | Fury Cutter | **Pineco / Ledian** / Scyther |
| Whitney | Plain | Attract | Clefairy / **Teddiursa** / Miltank |
| Morty | Fog | Shadow Ball | Haunter / **Stantler** / **Misdreavus** / Gengar |
| Chuck | Storm | DynamicPunch | badge-scaled 4/5/6 |
| Jasmine | Mineral | Iron Tail | badge-scaled; teams 1≈2 |
| Pryce | Glacier | Icy Wind | badge-scaled |
| Clair | Rising (หลัง Den) | DragonBreath | — |

## Formatting note
Notion tag colors: split rich_text — [EVENT]=blue bold, [ปริศนา]=orange bold, [สำคัญ]=brown bold, [Legacy ต่าง]=red bold, [เสริม]=green bold, [Repo check]=purple bold. Never overwrite as single default span.
