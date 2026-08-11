# Post-game Kanto audit — 2026-08-11

Hub sections: `Post-game / Kanto` + `Post-game — GS Ball / Celebi`  
Page: `3b7da311-a58e-80c2-b287-de7ce0dc63fd`

## Fixed in Notion

| Fix | Evidence |
|---|---|
| Metal Coat จาก **ตา** (ไม่ใช่เด็กหญิงเอง) + docking หลังได้ของทริปแรก | `FastShipCabins_SE_SSE_CaptainsCabin.asm` `SSAquaMetalCoatAndDocking` |
| Kanto gyms: Legacy levels ~57–69 + ตัวอย่าง Brock/Blue | `data/trainers/parties.asm` Brock/Misty/Surge/Blue |
| Mt. Silver: 16 Badge **+** E4 rematch (`EVENT_ELITE_4_REMATCH`) แล้วคุย Oak | `OaksLab.asm:40-50`; set ใน `LancesRoom.asm:82-84` เมื่อ badges ≥16 |
| Red: **Mewtwo 75** แทน Espeon (rematch ใช้ Espeon) | `parties.asm` RedGroup |
| Viridian Trainer House playtesters | `TrainerHouseB1F.asm` |
| GS Ball: Kurt ≥7 Badge + ทางเลือก Ruins Ho-Oh; Celebi Lv.30 | `KurtsHouse.asm`; `IlexForest.asm:467`; Ruins inner chamber |

## Verified OK

- S.S. Ticket จาก Elm หลัง HOF; เรือหลัง HOF เท่านั้น
- เส้นทาง Olivine ↔ Vermilion ไม่ใช่ Cianwood
- ตีเทรนเนอร์ก่อนเจอหลาน — docking หลัง Metal Coat ทริปแรก
- ตารางเรือหลังทริปแรก: Olivine→Vermilion จันทร์/ศุกร์; กลับ พุธ/อาทิตย์
- Kanto gyms ลำดับอิสระ
- Seafoam Strength puzzle (โครง)
- Celebi Lv.30 ที่ Ilex shrine

## Legacy highlights

| Topic | Diff |
|---|---|
| Mt. Silver gate | ต้อง E4 rematch ด้วย ไม่ใช่แค่ 16 badge |
| Red first fight | Mewtwo แทน Espeon |
| Kanto leaders | ทีมเต็ม 6 ตัว เลเวลสูง + legendaries บางคน |
| GS Ball → Kurt | ต้อง ≥7 badges (Legacy) |

## Still open / thin

- รายละเอียดยิม Kanto ทีละเมือง (TM rewards, puzzles)
- Power Plant / Magnet Train / Cerulean Cave / Rock Tunnel
- Blue / Koga / Janine party lists ยังไม่ใส่ครบ
