# 3️⃣ TEST PLAN - KẾ HOẠCH KIỂM THỬ
## E-Commerce Website Interface - Comprehensive Testing Strategy

**Ngày Viết:** 15 Tháng 10, 2026  
**Phiên Bản:** 1.0  
**Người Lập:** QA Team  
**Mục Đích:** Định hướng toàn diện cho kiểm thử hệ thống  
**Trạng Thái:** ✅ Ready for Execution

---

## 📋 MỤC LỤC

1. [Mục Đích Kiểm Thử](#1-mục-đích-kiểm-thử)
2. [Phạm Vi Kiểm Thử](#2-phạm-vi-kiểm-thử)
3. [Lịch Trình Kiểm Thử](#3-lịch-trình-kiểm-thử)
4. [Tài Nguyên & Công Cụ](#4-tài-nguyên--công-cụ)
5. [Chiến Lược Kiểm Thử](#5-chiến-lược-kiểm-thử)
6. [Điều Kiện Chấp Nhận](#6-điều-kiện-chấp-nhận)
7. [Phân Loại Lỗi & Mức Độ Nghiêm Trọng](#7-phân-loại-lỗi--mức-độ-nghiêm-trọng)
8. [Sản Phẩm Bàn Giao](#8-sản-phẩm-bàn-giao)
9. [Rủi Ro & Giả Định](#9-rủi-ro--giả-định)

---

## 1️⃣ Mục Đích Kiểm Thử

### Mục Tiêu Chính

| # | Mục Đích | Mô Tả | Target |
|---|---------|-------|--------|
| 1.1 | **Verify Functional Requirements** | Đảm bảo tất cả 10 chức năng (FR1-FR10) hoạt động đúng | 100% pass |
| 1.2 | **Verify Non-Functional Requirements** | Kiểm thử performance, security, scalability | 100% pass |
| 1.3 | **Identify Defects** | Tìm kiếm bugs, errors, exceptions | Document all |
| 1.4 | **Quality Assurance** | Đảm bảo chất lượng production-ready | Pass/Fail |
| 1.5 | **Risk Mitigation** | Giảm thiểu rủi ro khi deploy | Report risks |
| 1.6 | **Regression Prevention** | Kiểm thử để tránh hồi quy | Test all changes |
| 1.7 | **Performance Validation** | Xác nhận benchmark performance | <2s load |
| 1.8 | **Security Validation** | Kiểm thử security controls | No vulns |
| 1.9 | **User Experience** | Validate UX, usability | WCAG AA |

### Thành Công Của Testing

✅ **Testing được coi là thành công khi:**
- Tất cả test cases đều chạy
- > 95% test cases pass
- Tất cả critical bugs được fix
- Performance metrics met
- Security audit passed
- Deployment approved

### Failure Criteria

❌ **Testing thất bại nếu:**
- > 5% test cases fail
- Có critical bugs chưa fix
- Performance không đạt target
- Security vulnerabilities found
- Deployment blocked

---

## 2️⃣ Phạm Vi Kiểm Thử

### In Scope (✅ Kiểm Thử)

#### Functional Testing (BẮTBUỘC)

| Area | Test Coverage | Priority |
|------|--------------|----------|
| **Product Browsing** | List, search, filter, detail | High |
| **Cart Management** | Add, update, delete, persist | High |
| **Checkout** | Form, address selection, validation | High |
| **Shipping Fee** | GHN API, calculation, display | High |
| **Payment** | COD, Bank Transfer, selection | High |
| **Order Creation** | Create, validate, track, fbp+fbc | High |
| **Order Tracking** | List, detail, status, filter | High |
| **Meta Pixel** | PageView, AddToCart, Lead events | High |
| **Authentication** | Google OAuth, session, logout | High |
| **Favorites** | Add, remove, list, persist | Medium |

#### Non-Functional Testing (BẮTBUỘC)

| Area | Test Type | Priority |
|------|-----------|----------|
| **Performance** | Load time, API response, bundle size | High |
| **Security** | Auth, authorization, input validation | High |
| **Responsive Design** | Mobile, tablet, desktop | High |
| **Browser Compatibility** | Chrome, Firefox, Safari, Edge | High |
| **Accessibility** | WCAG AA, keyboard nav, screen reader | Medium |
| **Stability** | Error handling, recovery, timeout | High |
| **Scalability** | Concurrent users, database, API | Medium |

#### Integration Testing (BẮTBUỘC)

| Integration | Test Coverage | Priority |
|------------|---------------|---------| 
| **GHN API** | Calculate fee, error handling | High |
| **Meta Pixel** | fbp capture, fbc capture, events | High |
| **Supabase Auth** | OAuth, session, token | High |
| **Database** | Query, RLS, transaction | High |
| **Vercel API** | Deployment, scaling, monitoring | Medium |

#### End-to-End Testing (BẮTBUỘC)

| Scenario | Test Steps | Priority |
|----------|-----------|----------|
| **Complete Purchase Flow** | Browse → Cart → Checkout → Order → Tracking | High |
| **Meta Pixel Tracking** | AddToCart → fbp capture → Lead → Database | High |
| **Mobile Purchase** | Mobile flow: Browse → Cart → Checkout | High |
| **Payment Scenarios** | COD path, Bank Transfer path | High |

### Out of Scope (❌ KHÔNG Kiểm Thử)

- ❌ Mobile app (iOS/Android) - Web only
- ❌ Third-party payment gateways - COD/Bank only for v1
- ❌ Inventory management - No stock tracking
- ❌ Email/SMS notifications - Not implemented
- ❌ Multi-language - Vietnamese only
- ❌ Admin CRUD operations - Only view permissions for v1
- ❌ Advanced analytics - Basic tracking only
- ❌ API rate limiting - Not critical for v1

---

## 3️⃣ Lịch Trình Kiểm Thử

### Testing Timeline

**Total Duration:** 5 Days  
**Start Date:** 15 October 2026  
**End Date:** 19 October 2026

### Phase Breakdown

| Phase | Duration | Dates | Deliverable |
|-------|----------|-------|------------|
| **Phase 1: Test Planning & Setup** | 1 day | Oct 15 | Test Plan, Environment setup |
| **Phase 2: Manual Functional Testing** | 2 days | Oct 16-17 | Test Cases execution, Bug report |
| **Phase 3: Non-Functional Testing** | 1 day | Oct 18 | Performance, Security report |
| **Phase 4: Regression & Fix Validation** | 0.5 day | Oct 19 | Re-test fixed bugs |
| **Phase 5: Final QA & Report** | 0.5 day | Oct 19 | QA Report, Approval |

### Detailed Schedule

**Day 1 (Oct 15) - Planning & Setup**
- 09:00-10:00: Team meeting, review SRS
- 10:00-12:00: Environment setup, test data preparation
- 12:00-13:00: Lunch
- 13:00-15:00: Test cases review, tool setup
- 15:00-17:00: Buffer time

**Day 2 (Oct 16) - Functional Testing Part 1**
- 09:00-12:00: FR1-FR5 testing (Browse, Search, Cart, Checkout, Shipping)
- 12:00-13:00: Lunch
- 13:00-17:00: Continue FR1-FR5, document bugs
- 17:00+: Bug triage meeting

**Day 3 (Oct 17) - Functional Testing Part 2**
- 09:00-12:00: FR6-FR10 testing (Payment, Order, Tracking, Meta Pixel, Auth)
- 12:00-13:00: Lunch
- 13:00-17:00: Continue FR6-FR10, document bugs
- 17:00+: Bug triage meeting

**Day 4 (Oct 18) - Non-Functional Testing**
- 09:00-12:00: Performance testing, Load time measurement
- 12:00-13:00: Lunch
- 13:00-15:00: Security testing, Browser compatibility
- 15:00-17:00: Accessibility testing, Document findings

**Day 5 (Oct 19) - Regression & Report**
- 09:00-12:00: Fix verification, Regression testing
- 12:00-13:00: Lunch
- 13:00-16:00: Final report compilation
- 16:00-17:00: Approval meeting

---

## 4️⃣ Tài Nguyên & Công Cụ

### Tài Nguyên Con Người

| Role | Name | Responsibility | Hours |
|------|------|-----------------|-------|
| **QA Lead** | Person A | Plan, coordinate, report | 40 hrs |
| **QA Tester 1** | Person B | Functional testing | 40 hrs |
| **QA Tester 2** | Person C | NFR testing | 40 hrs |
| **Dev Support** | Person D | Environment, bug fix | 20 hrs |

**Total Effort:** 140 hours (3.5 person-weeks)

### Công Cụ Kiểm Thử

| Công Cụ | Mục Đích | Cài Đặt |
|---------|---------|--------|
| **Browser DevTools** | Inspect, debug, network | Built-in (Chrome/Firefox) |
| **Lighthouse** | Performance, accessibility, SEO | Chrome DevTools / CLI |
| **Postman** | API testing, GHN API validation | Desktop app / Web |
| **Git** | Version control, code review | Already setup |
| **VS Code** | Code inspection, debugging | Already setup |
| **SQL Client** | Database query, data verification | Supabase Studio |
| **Excel** | Test case documentation, reporting | Local |
| **Screenshots/Recording** | Evidence, bug reproduction | Built-in / ScreenFlow |

### Môi Trường Kiểm Thử

| Environment | URL | Database | Status |
|------------|-----|----------|--------|
| **Production** | https://e-commerce-website-interface.vercel.app | Supabase prod | ✅ Live |
| **Development** | http://localhost:3000 | Supabase dev | ✅ Available |
| **Staging** | (Optional) | (Optional) | ⏳ Not setup |

### Test Data

**Test Accounts:**
```
User 1:
- Email: qa.test1@gmail.com
- Name: QA Test User 1
- Auth: Google OAuth

User 2:
- Email: qa.test2@gmail.com
- Name: QA Test User 2
- Auth: Google OAuth
```

**Test Products:**
- 10+ products available in Supabase
- Multiple variants per product (colors, sizes)
- Images attached to products and variants

**Test Addresses (GHN):**
- Sơn La → Huyện Mộc Châu (Shop location)
- TP. Hồ Chí Minh → Quận 1
- Hà Nội → Quận Ba Đình
- Đà Nẵng → Quận Hải Châu

---

## 5️⃣ Chiến Lược Kiểm Thử

### Testing Approach

**Multi-Level Testing Strategy:**

```
┌─────────────────────────────────────────────────────┐
│         Testing Pyramid                              │
├─────────────────────────────────────────────────────┤
│                                                       │
│          E2E Testing (1-2 days)                      │
│        ┌──────────────────────┐                      │
│        │  Complete user flows  │                     │
│        │  Cross-browser        │                     │
│        │  Mobile simulation    │                     │
│        └──────────────────────┘                      │
│                                                       │
│        Integration Testing (1 day)                   │
│      ┌──────────────────────────┐                    │
│      │ GHN API integration      │                    │
│      │ Supabase integration     │                    │
│      │ Meta Pixel integration   │                    │
│      └──────────────────────────┘                    │
│                                                       │
│  Unit/Functional Testing (2 days)                    │
│ ┌────────────────────────────────────┐              │
│ │ Individual feature testing          │              │
│ │ Component functionality             │              │
│ │ Business logic validation           │              │
│ └────────────────────────────────────┘              │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### Testing Types

| Testing Type | Scope | Effort | Priority |
|-------------|-------|--------|----------|
| **Manual Functional** | All 10 FR | 60% | High |
| **Automated Regression** | Critical paths | 20% | High |
| **Performance** | Load, speed, bundle | 10% | High |
| **Security** | Auth, injection, XSS | 5% | High |
| **Accessibility** | WCAG AA compliance | 3% | Medium |
| **Compatibility** | Browsers, devices | 2% | High |

### Test Case Design

**Total Test Cases:** ~80 test cases
- FR1-FR10: ~60 functional test cases
- NFR: ~20 non-functional test cases

**Test Case Categories:**

1. **Positive Tests:** Happy path scenarios (70%)
2. **Negative Tests:** Invalid input, error handling (20%)
3. **Edge Cases:** Boundary conditions, limits (10%)

**Test Case Format:**
```
Test Case ID: TC-[Module]-[Number]
Title: Clear description
Priority: High/Medium/Low
Prerequisite: Pre-conditions
Steps: 1. Step 1, 2. Step 2, ...
Expected Result: What should happen
Actual Result: (Filled during execution)
Status: Pass/Fail
Evidence: Screenshot/logs
```

### Traceability Matrix

```
SRS Requirement → Test Case → Test Execution Result
                    ↓
               Pass/Fail Status
                    ↓
            Acceptance Criteria
```

---

## 6️⃣ Điều Kiện Chấp Nhận (Acceptance Criteria)

### Overall Test Acceptance

**Project is ACCEPTED for Production when:**

| Criteria | Target | Measurement |
|----------|--------|-------------|
| **Functional Completeness** | 100% | All 10 FR implemented & tested |
| **Test Pass Rate** | > 95% | (Passed / Total) * 100 |
| **Critical Bugs** | 0 | No critical severity bugs remaining |
| **High Bugs** | ≤ 2 | High severity bugs acceptable with workaround |
| **Performance** | Met | Load < 2s, API < 500ms |
| **Security** | Pass | No vulnerabilities, auth working |
| **Mobile Responsive** | 100% | Tested on 3+ device sizes |
| **Browser Compat** | 4/4 | Chrome, Firefox, Safari, Edge |
| **Code Quality** | Good | Code review approved |
| **Documentation** | Complete | All docs up-to-date |

### Per-Feature Acceptance

**Each Feature is accepted when:**

```javascript
const featureAcceptance = {
  requirements: "100% implemented",
  testCases: "100% executed",
  passRate: "> 95% pass",
  bugs: "All critical fixed, high reviewed",
  performance: "Metrics met",
  codeReview: "Approved",
  documentation: "Complete"
}
```

### Test Execution Criteria

**Each Test Case:**
- ✅ Executed as written
- ✅ Result documented (Pass/Fail)
- ✅ Evidence attached (screenshot/log)
- ✅ If Fail: Defect report created
- ✅ If Pass: Move to next test case

---

## 7️⃣ Phân Loại Lỗi & Mức Độ Nghiêm Trọng

### Severity Levels

| Level | Icon | Định Nghĩa | Ví Dụ | Fix Time |
|-------|------|-----------|-------|----------|
| **Critical** | 🔴 | Hệ thống không hoạt động, không thể dùng | Cannot checkout, database down, security breach | Same day |
| **High** | 🟠 | Chức năng chính bị ảnh hưởng | Search not working, orders not saving | 1-2 days |
| **Medium** | 🟡 | Tính năng bị ảnh hưởng nhưng có workaround | Slow loading, UI misalignment | 3-5 days |
| **Low** | 🟢 | Minor issue, cosmetic, workaround available | Typo, color mismatch, small UI bug | Next sprint |

### Priority Matrix

```
          ┌─────────────────────────────────────┐
Priority  │  Critical │ High  │ Med  │ Low  │
          ├─────────────────────────────────────┤
Blocking  │    ✅     │  ✅   │  ✅  │      │
          ├─────────────────────────────────────┤
Major     │    ✅     │  ✅   │  ✅  │  ✅  │
          ├─────────────────────────────────────┤
Minor     │    ✅     │  ⚠️  │  ✅  │  ✅  │
          ├─────────────────────────────────────┤
Enhancement│   ⏳     │  ⏳   │  ⏳  │  ⏳  │
          └─────────────────────────────────────┘
```

### Defect Status Workflow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  New    │───>│ Assigned│───>│ Fixed   │───>│ Verified│
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │               │              │              │
     └───────────────┴──────────────┴──────────────┘
                  Rejected/Reopened
```

### Resolution Categories

| Category | Action | Priority |
|----------|--------|----------|
| **Fixed** | Bug fixed, ready for re-test | All levels |
| **Duplicate** | Similar bug already reported | Close |
| **Not Reproducible** | QA cannot reproduce | Reopen/Close |
| **By Design** | Expected behavior | Close |
| **Deferred** | Moved to next version | Document |
| **Cannot Fix** | Technical limitation | Escalate |

---

## 8️⃣ Sản Phẩm Bàn Giao (Deliverables)

### Testing Deliverables

| Deliverable | Format | Owner | Due Date |
|------------|--------|-------|----------|
| **Test Plan** | MD/PDF | QA Lead | Oct 15 |
| **Test Cases** | Excel/MD | QA Tester | Oct 15 |
| **Test Execution Report** | MD | QA Tester | Oct 19 |
| **Bug Report** | Excel/JIRA | QA Tester | Daily |
| **Performance Report** | MD/PDF | QA Dev | Oct 18 |
| **Security Report** | MD/PDF | QA Dev | Oct 18 |
| **Final QA Report** | MD/PDF | QA Lead | Oct 19 |
| **Sign-off Document** | PDF | QA Lead | Oct 19 |

### Test Case Deliverable

**Format:**
- File: `4_TEST_CASES_DESIGN.md` (Detailed)
- File: `4_TEST_CASES.xlsx` (Spreadsheet for tracking)

**Contents:**
- 80+ test cases
- For each FR: 5-8 test cases (positive + negative)
- For each NFR: 2-5 test cases

### Execution Report Deliverable

**File:** `5_TEST_EXECUTION_AND_BUG_REPORT.md`

**Contents:**
- Total test cases: X
- Passed: Y
- Failed: Z
- Pass Rate: (Y/X)*100%
- Bugs found: Count by severity
- Screenshots/evidence
- Recommendations

### Final QA Report Deliverable

**File:** `6_QA_QUALITY_ASSESSMENT_REPORT.md`

**Contents:**
- Executive summary
- Test overview
- Defect analysis
- Metrics & charts
- Risks & recommendations
- Sign-off status

### Sign-off Document

**Contents:**
- QA Lead signature
- Test completion date
- Approval status (Pass/Fail/Conditional)
- Known issues (if any)

---

## 9️⃣ Rủi Ro & Giả Định

### Assumptions (Giả Định)

| # | Giả Định | Impact |
|---|---------|--------|
| A1 | Test environment stable throughout testing | High |
| A2 | Test data available & unchanged | High |
| A3 | GHN API available during testing | High |
| A4 | Supabase database operational | High |
| A5 | Vercel deployment working | High |
| A6 | No major scope changes | High |
| A7 | Team availability 40 hrs/week | Medium |
| A8 | Dev support available for fixes | Medium |
| A9 | Network connectivity stable | Medium |
| A10 | No critical infrastructure issues | Medium |

### Identified Risks

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|-----------|
| R1 | GHN API downtime | Medium | Critical | Mock API for testing |
| R2 | Database performance degradation | Low | High | Load testing in advance |
| R3 | OAuth Google downtime | Low | High | Manual test fallback |
| R4 | Network latency issues | Medium | Medium | Use local network |
| R5 | Test data not sufficient | Medium | High | Prepare more test data |
| R6 | Scope creep in SRS | Low | Medium | Strict scope control |
| R7 | Bug fix delays | Medium | Medium | Escalate to dev lead |
| R8 | Performance regression | Low | High | Regression tests |
| R9 | Browser incompatibility | Low | Medium | Focus on main browsers |
| R10 | Mobile testing device shortage | Medium | Low | Use emulator as backup |

### Risk Contingency Plans

**If GHN API fails:**
- Use mock API responses for testing
- Test with stored test data
- Mock shipping fee calculations

**If Supabase fails:**
- Use local development database
- Postpone data-dependent tests
- Focus on UI testing

**If deployment fails:**
- Test on localhost instead
- Use previous production version
- Manual testing only

**If team not available:**
- Reduce test case coverage
- Focus on critical paths only
- Compress timeline

---

## 📊 Success Metrics

### Testing Metrics

```
┌──────────────────────────────────────────┐
│  Key Testing Metrics                      │
├──────────────────────────────────────────┤
│ Test Case Pass Rate:     > 95%            │
│ Bug Discovery Rate:      < 5 bugs/day     │
│ Critical Bugs:           0                │
│ High Bugs:               ≤ 2 (with fix)   │
│ Test Execution Time:     < 5 days         │
│ Code Coverage:           > 80%            │
│ Performance Met:         100%             │
│ Security Passed:         100%             │
└──────────────────────────────────────────┘
```

### Quality Gates

**Testing cannot complete until:**

✅ **Functional Quality:**
- All test cases executed
- Pass rate > 95%
- All critical bugs fixed
- All high bugs fixed/workaround

✅ **Performance Quality:**
- Load time < 2 seconds
- API response < 500ms
- Bundle size < 150KB
- Lighthouse score > 85

✅ **Security Quality:**
- No SQL injection found
- No XSS vulnerabilities
- Authentication working
- Authorization verified

✅ **Compatibility Quality:**
- 4 browsers tested
- 3 device sizes tested
- No critical incompatibilities

✅ **Documentation Quality:**
- Test plan complete
- Test cases documented
- Bug reports clear
- QA report written

---

## 📝 Approval & Sign-off

**Test Plan Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **QA Lead** | [Person A] | _________________ | ___/___/___ |
| **Dev Lead** | [Person D] | _________________ | ___/___/___ |
| **Product Owner** | [Manager] | _________________ | ___/___/___ |

**Test Execution Approval:**
(To be signed after Phase 5 completion)

---

**Test Plan Status:** ✅ **APPROVED & READY FOR EXECUTION**

**Next Steps:**
1. ✅ Review and sign-off this Test Plan
2. ⏳ Execute Phase 1: Environment setup (Oct 15)
3. ⏳ Execute Phase 2: Functional testing (Oct 16-17)
4. ⏳ Execute Phase 3: NFR testing (Oct 18)
5. ⏳ Execute Phase 4-5: Regression & Report (Oct 19)

---

**Document Prepared By:** QA Team  
**Prepared Date:** 15 October 2026  
**Version:** 1.0  
**Status:** ✅ Ready for Testing Execution
