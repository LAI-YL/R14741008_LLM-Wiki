---
title: 審計風險模型（Audit Risk Model）
type: concept
tags: [風險評估, AUD]
sources: [src-us-audit-primer, src-rag-audit-cards, src-pcaob-official-standards-web]
updated: 2026-11-16
---

# 審計風險模型（Audit Risk Model）

**一句話定義：** 審計風險（AR）是財報存在重大不實表達、但查核人員卻出具不適當意見的風險，可拆解為 AR = IR × CR × DR。

$$
AR = \underbrace{IR \times CR}_{RMM} \times DR
$$

## 重點

- **查核的目標**：查核人員無法把審計風險降到零，而是降到「適當的低水準」，藉此取得**合理確信**（不是絕對保證）。（AS 1101）
- **RMM 分兩個層級**：
  - **財報整體層級**：普遍影響整份財報、牽動許多聲明，例如控制環境無效，常與舞弊有關。
  - **個別聲明層級**：由固有風險與控制風險組成，查核人員據此設計各科目的程序。

- **重大不實表達風險（RMM）** = 固有風險（Inherent Risk, IR）× 控制風險（Control Risk, CR），屬於受查者本身的風險，查核人員只能**評估**。
- **偵查風險（Detection Risk, DR）**：查核程序未能偵出重大不實表達的風險，是查核人員唯一能**控制**的部分。
- 在可接受的審計風險固定時，RMM 與 DR 呈**反向關係**：RMM 越高 → 可接受的 DR 越低 → 證實程序要更多、更有效、越接近期末執行。
- **偵查風險越低 → 需要的證據越多**：RMM 越高，可接受的 DR 越低，證實程序就要取得越多證據。（AS 1101）
- 調整 DR 的三個方向：程序的**性質**（nature）、**時間**（timing）、**範圍**（extent）。具體做法例如：擴大證實測試樣本、把測試時點從期中移到資產負債表日、改採更可靠的外部程序（如 [[external-confirmations|函證]]）。
- 評估 RMM 時，要了解受查者內部控制的五大要素（COSO 架構，口訣 **CRIME**）。
- RMM 包含因舞弊造成的風險，見 [[fraud-risk]]；上市公司另見 [[as-2110]]。
- 若依賴服務機構的控制來降低 CR，必須取得 SOC Type 2 報告（見 [[at-c-320]]）。

## 在美國準則中的位置

| 準則體系 | 相關準則 | 說明 |
|---|---|---|
| PCAOB（上市公司） | AS 1101；[[as-2110]] | 審計風險的定義與組成；風險辨認與評估 |
| AICPA（非上市公司） | AU-C 315 | 了解受查者並評估 RMM（SAS No. 145 修訂） |

內部控制的測試結果會直接影響 CR 的評估，上市公司的內控查核見 [[as-2201]]。

## 常見考點

> [!exam] 考點
> 題目問「查核人員可以改變哪一個風險？」→ 只有 **DR**。問「RMM 提高時怎麼辦？」→ 降低可接受的 DR，也就是擴大證實程序，**不是**降低 IR 或 CR。

## 相關頁面

- [[materiality]]
- [[aicpa-au-c-standards]]
- [[pcaob-auditing-standards]]

## 來源

- [[src-us-audit-primer]]
- [[src-rag-audit-cards]]
- [[src-pcaob-official-standards-web]]
