# Performance Optimization Report

## Baseline Measurements

### Interaction A: Sort countries

- **Commit duration**: 2.6 s
- **Render duration**: 395.9 ms
- **Screenshot**: ![screenshot](performance-starter/screenshots/baseline/InteractionA.png)

### Interaction B: Search countries

- **Commit duration**: 2.8 s
- **Render duration**: 182.7 ms
- **Screenshot**: ![screenshot](performance-starter/screenshots/baseline/InteractionB.png)

### Interaction C: Change year

- **Commit duration**: 2.9 s
- **Render duration**: 39.6 ms
- **Screenshot**: ![screenshot](performance-starter/screenshots/baseline/InteractionC.png)

### Interaction D: Toggle column

- **Commit duration**: 2 s
- **Render duration**: 42.1 ms
- **Screenshot**: ![screenshot](performance-starter/screenshots/baseline/InteractionD.png)

## Optimized Measurements

### Interaction A: Sort countries

- **Commit duration**: 1.9 s
- **Render duration**: 24.2 ms
- **Screenshot**: ![screenshot](performance-starter/screenshots/optimized/InteractionA.png)

### Interaction B: Search countries

- **Commit duration**: 2.9 s
- **Render duration**: 33.9 ms
- **Screenshot**: ![screenshot](performance-starter/screenshots/optimized/InteractionB.png)

### Interaction C: Change year

- **Commit duration**: 3.6 s
- **Render duration**: 39.3 ms
- **Screenshot**: ![screenshot](performance-starter/screenshots/optimized/InteractionC.png)

### Interaction D: Toggle column

- **Commit duration**: 1.1 s
- **Render duration**: 12.3 ms
- **Screenshot**: ![screenshot](performance-starter/screenshots/optimized/InteractionD.png)

## Summary of Improvements

| Interaction      | Baseline (ms) | Optimized (ms) | Improvement |
| ---------------- | ------------- | -------------- | ----------- |
| Sort countries   | 395.9        | 24.2         | 94%     |
| Search countries | 182.7        | 33.9         | 81%     |
| Change year      | 39.6        | 39.3         | 1%     |
| Toggle column    | 42.1        | 12.3         | 71%     |
| **Average**      | **165**    | **27.4**     | **61.8%** |