# Mapeamento Completo: mov_recebido.json (GET) ↔ mov_enviar.json (POST)

> Regra geral: GET usa `camelCase`, POST usa `PascalCase`.
> Campos com `—` na coluna do parceiro não existem naquele lado.

---

## 1. CABEÇALHO (nível raiz)

| GET (recebido) | POST (enviar) | Observação |
|---|---|---|
| `internalId` | `InternalId` | |
| `companyId` | `CompanyId` | |
| `movementId` | `MovementId` | |
| `branchId` | `BranchId` | |
| `warehouseCode` | `WarehouseCode` | |
| `customerVendorCode` | `CustomerVendorCode` | |
| `customerVendorCompanyId` | `CustomerVendorCompanyId` | |
| `number` | `Number` | |
| `series` | `Series` | |
| `movementTypeCode` | `MovementTypeCode` | |
| `type` | `Type` | |
| `status` | `Status` | |
| `printed` | `Printed` | |
| `documentPrinted` | `DocumentPrinted` | |
| `billPrinted` | `BillPrinted` | |
| `registerDate` | `RegisterDate` | |
| `date` | `Date` | |
| `deliveryDate` | `DeliveryDate` | |
| `entryDate` | `EntryDate` | |
| `creationDate` | `CreationDate` | |
| `processingDate` | `ProcessingDate` | |
| `lastEditTime` | `LastEditTime` | |
| `paymentTermCode` | `PaymentTermCode` | |
| `grossValue` | `GrossValue` | |
| `netValue` | `NetValue` | |
| `informedNetValue` | `InformedNetValue` | |
| `otherValues` | `OtherValues` | |
| `originalGrossValue` | `OriginalGrossValue` | |
| `originalNetValue` | `OriginalNetValue` | |
| `originalOtherValues` | `OriginalOtherValues` | |
| `freightPercentage` | `FreightPercentage` | |
| `freightValue` | `FreightValue` | |
| `transportedProductNetWeight` | `TransportedProductNetWeight` | |
| `transportedProductGrossWeight` | `TransportedProductGrossWeight` | |
| `financialOptionalTable1Code` | `FinancialOptionalTable1Code` | |
| `financialEntryMovementId` | `FinancialEntryMovementId` | |
| `netValueCurrencyCode` | `NetValueCurrencyCode` | |
| `generatedEntryNumber` | `GeneratedEntryNumber` | |
| `hasGeneratedBill` | `HasGeneratedBill` | |
| `openEntryNumber` | `OpenEntryNumber` | |
| `auxCustomerVendorCode` | `AuxCustomerVendorCode` | |
| `auxCustomerVendorCompanyId` | `AuxCustomerVendorCompanyId` | |
| `cashAccountCode` | `CashAccountCode` | |
| `cashAccountCompanyId` | `CashAccountCompanyId` | |
| `chargePercentage` | `ChargePercentage` | |
| `salesman2ChargePercentage` | `Salesman2ChargePercentage` | |
| `salesman3ChargePercentage` | `Salesman3ChargePercentage` | |
| `salesman4ChargePercentage` | `Salesman4ChargePercentage` | |
| `userCode` | `UserCode` | |
| `destinyBranchId` | `DestinyBranchId` | |
| `lotGenerated` | `LotGenerated` | |
| `accountingExportStatus` | `AccountingExportStatus` | |
| `hasGeneratedWorkAccount` | `HasGeneratedWorkAccount` | |
| `workAccountGenerated` | `WorkAccountGenerated` | |
| `indicateObjectUse` | `IndicateObjectUse` | |
| `bonumIntegrated` | `BonumIntegrated` | |
| `processedFlag` | `ProcessedFlag` | |
| `icmsDeductionValue` | `ICMSDeductionValue` | |
| `creationUser` | `CreationUser` | |
| `emailStatus` | `EmailStatus` | |
| `internalGrossValue` | `InternalGrossValue` | |
| `storeFrontBound` | `StoreFrontBound` | |
| `otherCompanyINSSBaseValue` | `OtherCompanyINSSBaseValue` | |
| `conditionalDiscountValue` | `ConditionalDiscountValue` | |
| `conditionalExpenseValue` | `ConditionalExpenseValue` | |
| `commercialAutomationExported` | `CommercialAutomationExported` | |
| `aplicationIntegration` | `AplicationIntegration` | |
| `nfeReceiptStatus` | `NFEReceiptStatus` | |
| `customerVendorHistoryId` | `CustomerVendorHistoryId` | |
| `merchandiseValue` | `MerchandiseValue` | |
| `usesFinancialValueApportionment` | `UsesFinancialValueApportionment` | |
| `integrationId` | `IntegrationId` | |
| `conclusionFlag` | `ConclusionFlag` | |
| `paradigmaStatus` | `ParadigmaStatus` | |
| `totvsColabGeneratedStatus` | `TotvsColabGeneratedStatus` | |
| `paradigmaAutoIntegrated` | `ParadigmaAutoIntegrated` | |
| `operationId` | `OperationId` | |
| `scpBranchId` | `ScpBranchId` | |
| `recCreatedBy` | `RECCREATEDBY` | casing diferente |
| `recCreatedOn` | `RECCREATEDON` | casing diferente |
| `recModifiedBy` | `RECMODIFIEDBY` | casing diferente |
| `recModifiedOn` | `RECMODIFIEDON` | casing diferente |
| `complementaryFields` | `complementaryFields` | camelCase nos dois |
| `shortHistory` | `Observation` | **renomeado** |
| `commercialRepresentativeCharge` | `CommercialRepresentativeCharge` | |

### Apenas no GET (raiz)

| Campo GET | Observação |
|---|---|
| `cityOperCode` | Código de cidade da operação — somente leitura |
| `stateOperCode` | UF da operação — somente leitura |

### Apenas no POST (raiz)

| Campo POST | Observação |
|---|---|
| `DeliveryWarehouseCode` | Armazém de entrega |
| `DestinyWarehouseCode` | Armazém destino |
| `CustomerVendorNatureCodeCompanyId` | Empresa da natureza do fornecedor/cliente |
| `CustomerVendorNatureCode` | Natureza do fornecedor/cliente |
| `CustomerVendorNatureCompanyId` | |
| `ExtraDate1` | Data extra 1 |
| `ExtraDate2` | Data extra 2 |
| `ExtraPercentage1` | Percentual extra 1 |
| `ExtraPercentage2` | Percentual extra 2 |
| `ExtraValue1` | Valor extra 1 |
| `ExtraValue2` | Valor extra 2 |
| `TransportedProductBrand` | Marca do produto transportado |
| `TransportedProductNumber` | Número do produto transportado |
| `TransportedProductQuantity` | Quantidade do produto transportado |
| `TransportedProductKind` | Tipo do produto transportado |
| `CancellationDate` | Data de cancelamento |
| `AccountingEventCode` | Código do evento contábil |
| `AccountingDate` | Data contábil |
| `AccountingType` | Tipo contábil |
| `FreeField1` | Campo livre 1 |
| `FreeField2` | Campo livre 2 |
| `FreeField3` | Campo livre 3 |
| `ScheduledDeliveryDate` | Data de entrega agendada |
| `ScheduleDate` | Data de agendamento |
| `PreviusScheduleDate` | Data de agendamento anterior |
| `DocumentTypeCode` | Código do tipo de documento |
| `IRRFDeductionCode` | Código de dedução IRRF |
| `IRRFDeductionPercentage` | Percentual de dedução IRRF |
| `EmployerBaseINSSPercentage` | INSS base empregador |
| `EmployeeBaseINSSPercentage` | INSS base empregado |
| `DestinyDepartmentCode` | Código do departamento destino |
| `TransportRouteCode` | Código de rota de transporte |
| `TransportRoute` | Rota de transporte |
| `ServiceTotalValue` | Valor total de serviço |
| `OriginalFinancialEntryApportionmentValue` | Valor de rateio de entrada financeira original |
| `FreightNatureId` | ID da natureza do frete |
| `AffectStockOrder` | Afeta ordem de estoque |
| `PartialBillingReceivedValue` | Valor recebido de faturamento parcial |
| `CompletedValue` | Valor concluído |
| `TSSId` | ID TSS |
| `PredominantProduct` | Produto predominante |
| `DeliveryDistanceTravelled` | Distância percorrida na entrega |
| `FreightCalculationUnit` | Unidade de cálculo do frete |
| `FreightCalculationForm` | Forma de cálculo do frete |
| `ConsumptionClass` | Classe de consumo |
| `ConsumptionType` | Tipo de consumo |
| `SubscriberType` | Tipo de assinante |
| `Level` | Nível |
| `UtilizationType` | Tipo de utilização |
| `TensionGroup` | Grupo de tensão |
| `Extemporaneous` | Extemporâneo |
| `IgnoreRSNMovement` | Ignorar movimento RSN |
| `NFEReceiptType` | Tipo de recebimento NFE |
| `NFEReceiptNumber` | Número de recebimento NFE |
| `NFEReceiptSituation` | Situação de recebimento NFE |
| `NFEReceiptSeries` | Série de recebimento NFE |
| `AutonomousOC` | OC autônoma |
| `VolumesNature` | Natureza dos volumes |
| `Volumes` | Volumes |
| `OperationRestartCounter` | Contador de reinício de operação |
| `OriginCustomerVendorCompanyId` | Empresa de origem do fornecedor/cliente |
| `OriginCustomerVendor` | Fornecedor/cliente de origem |
| `CTRCApportionmentValue` | Valor de rateio CTRC |
| `CustomerVendorCeiId` | ID CEI do fornecedor/cliente |
| `NFeAccesskey` | Chave de acesso NFe |
| `SecCatValue` | Valor SecCat |
| `DispatchValue` | Valor de despacho |
| `TollValue` | Valor de pedágio |
| `OtherFreightValue` | Outros valores de frete |
| `TaxRelief` | Redução fiscal |
| `InsurancePercentage` | Percentual de seguro |
| `InsuranceValue` | Valor de seguro |
| `DiscountPercentage` | Percentual de desconto |
| `DiscountValue` | Valor de desconto |
| `ExpensePercentage` | Percentual de despesa |
| `ExpenseValue` | Valor de despesa |
| `MessageCode` | Código de mensagem |
| `Message2Code` | Código de mensagem 2 |
| `VehiclePlate` | Placa do veículo |
| `VehiclePlateStateCode` | UF da placa |
| `ClassificationTable1Code` | Tabela de classificação 1 |
| `ClassificationTable2Code` | Tabela de classificação 2 |
| `ClassificationTable3Code` | Tabela de classificação 3 |
| `ClassificationTable4Code` | Tabela de classificação 4 |
| `ClassificationTable5Code` | Tabela de classificação 5 |
| `FinancialOptionalTable2Code` | Tabela opcional financeira 2 |
| `FinancialOptionalTable3Code` | Tabela opcional financeira 3 |
| `FinancialOptionalTable4Code` | Tabela opcional financeira 4 |
| `FinancialOptionalTable5Code` | Tabela opcional financeira 5 |
| `RelatedMovementId` | ID de movimento relacionado |
| `UnfoldedOrderId` | ID de pedido desdobrado |
| `BaseDate` | Data base |
| `ExportFlag` | Flag de exportação |
| `BillIssuer` | Emissor de cobrança |
| `DiscountMessageCode` | Código de mensagem de desconto |
| `ExpenseMessageCode` | Código de mensagem de despesa |
| `FreightMessageCode` | Código de mensagem de frete |
| `FreightType` | Tipo de frete |
| `UsesFinancialExpense` | Usa despesa financeira |
| `TreasuryDepartmentExportFlag` | Flag de exportação da tesouraria |
| `AdvanceValue` | Valor de antecipação |
| `CarrierCode` | Código da transportadora |
| `Carrier2Code` | Código da transportadora 2 |
| `ReleaseStatus` | Status de liberação |
| `BillingLotId` | ID do lote de faturamento |
| `GroupedItems` | Itens agrupados |
| `BillingPrintFlag` | Flag de impressão de cobrança |
| `RecievedValue` | Valor recebido (atenção: typo na API — RecIEved) |
| `SecondNumber` | Número secundário |
| `CostCenterCode` | Código do centro de custo |
| `DepartmentCode` | Código do departamento |
| `DestinyCostCenterCode` | Código do centro de custo destino |
| `Salesman1Code` | Código do vendedor 1 |
| `Salesman2Code` | Código do vendedor 2 |
| `Salesman3Code` | Código do vendedor 3 |
| `Salesman4Code` | Código do vendedor 4 |
| `DeliveryBranchId` | Filial de entrega |
| `FluxusGroupedFlag` | Flag de agrupamento Fluxus |
| `CostCenterDepartmentApportionmentValue` | Valor de rateio depto/CC |
| `FinancialEntryApportionmentValue` | Valor de rateio de entrada financeira |
| `CustomerVendorBillingTransferCompanyId` | Empresa de transferência de cobrança |
| `CustomerVendorBillingTransfer` | Transferência de cobrança |
| `DiscountApprovalUserCode` | Usuário de aprovação de desconto |
| `PreviousStatus` | Status anterior |
| `ExportedAccountingLotCode` | Código do lote contábil exportado |
| `CheckReceiveStatus` | Status de verificação de recebimento |
| `FiscalNatureId` | ID da natureza fiscal |
| `FiscalNature2Id` | ID da natureza fiscal 2 |
| `FiscalEntryCode` | Código de entrada fiscal |
| `ClosingDate` | Data de fechamento |
| `ClosingDateSequentialNumber` | Número sequencial da data de fechamento |
| `NoteReceiptNumber` | Número de recebimento de nota |
| `ProcessesLotId` | ID do lote de processos |
| `MaintenanceObjectId` | ID do objeto de manutenção |
| `SubSeries` | Sub-série |
| `PurchaseStatus` | Status de compra |
| `DispatchSiteCode` | Código do local de despacho |
| `ClassificationId` | ID de classificação |
| `DeliveryCode` | Código de entrega |
| `DeliveryRangeCode` | Código de faixa de entrega |
| `FiscalBookkeepingEntryLot` | Lote de entrada escrituração fiscal |
| `ProjectId` | ID do projeto |
| `CouponNumber` | Número do cupom |
| `CashierNumber` | Número do caixa |
| `BalanceEffect` | Efeito no saldo |
| `EntryCurrencyCode` | Código de moeda de entrada |
| `Unnumbered` | Sem número |
| `RegisterTime` | Hora de registro |
| `ReturnDate` | Data de devolução |
| `DeliveryContactId` | ID de contato de entrega |
| `BillingContactId` | ID de contato de cobrança |
| `SortingStatus` | Status de separação |
| `CTRCFreightValue` | Valor de frete CTRC |
| `SalesPointCode` | Código do ponto de venda |
| `DeliveryTime` | Prazo de entrega |
| `AuthorizationsId` | ID de autorizações |
| `StoreFrontStockId` | ID de estoque da loja |
| `ZReductionId` | ID de redução Z |
| `ExitTime` | Hora de saída |
| `ExitDate` | Data de saída |
| `ServiceProviderCityCode` | Código de cidade do prestador de serviço |
| `ServiceProviderStateCode` | UF do prestador de serviço |
| `Appropriated` | Apropriado |
| `ServiceCode` | Código de serviço |
| `DeductionDate` | Data de dedução |
| `LogbookCode` | Código de diário |
| `LogbookSequentialCode` | Código sequencial de diário |
| `ReversalLogbookSequentialCode` | Código sequencial de estorno do diário |
| `OtherCompanyINSSValue` | Valor INSS de outra empresa |
| `CTRCMovementId` | ID de movimento CTRC |
| `CommercialRepresentativeCode` | Código do representante comercial |
| `TaxesNumber` | Número de impostos |
| `AcquiringCnpjCpf` | CNPJ/CPF adquirente |
| `AcquiringName` | Nome adquirente |
| `AcquiringForeignDoc` | Documento estrangeiro adquirente |
| `ContractStatus` | Status do contrato |
| `CompletedStatus` | Status concluído |
| `OrderNumber` | Número do pedido |

---

## 2. ITENS (`movementItems` → `Items`)

| GET (`movementItems[]`) | POST (`Items[]`) | Observação |
|---|---|---|
| `companyId` | `CompanyId` | |
| `movementId` | `MovementId` | |
| `sequentialId` | `SequentialId` | |
| `sequentialNumber` | `SequentialNumber` | |
| `productId` | `ProductId` | |
| `quantity` | `Quantity` | |
| `unitPrice` | `UnitPrice` | |
| `tablePrice` | `TablePrice` | |
| `registerDate` | `RegisterDate` | |
| `deliveryDate` | `DeliveryDate` | |
| `measureUnitCode` | `MeasureUnitCode` | |
| `measureUnitConversionRate` | `MeasureUnitConversionRate` | |
| `receivableQuantity` | `ReceivableQuantity` | |
| `originalQuantity` | `OriginalQuantity` | |
| `totalQuantity` | `TotalQuantity` | |
| `sortedQuantity` | `SortedQuantity` | |
| `completedQuantity` | `CompletedQuantity` | |
| `partialBillingReceivedValue` | `PartialBillingReceivedValue` | |
| `completedValue` | `CompletedValue` | |
| `unitValue` | `UnitValue` | |
| `financialValue` | `FinancialValue` | |
| `netValue` | `NetValue` | |
| `grossValue` | `GrossValue` | |
| `originalGrossValue` | `OriginalGrossValue` | |
| `totalValue` | `TotalValue` | |
| `ordinationTaxAliquot` | `OrdinationTaxAliquot` | |
| `flag` | `Flag` | |
| `branchId` | `BranchId` | |
| `commercialRepresentativeChargePercentage` | `CommercialRepresentativeChargePercentage` | |
| `fiscalBookkeepingValue` | `FiscalBookkeepingValue` | |
| `orderFinancialValue` | `OrderFinancialValue` | |
| `ctrcFreightValue` | `CTRCFreightValue` | |
| `optionalFormulaValue1` | `OptionalFormulaValue1` | |
| `optionalFormulaValue2` | `OptionalFormulaValue2` | |
| `editedPrice` | `EditedPrice` | |
| `unitaryOccupiedVolumeNumber` | `UnitaryOccupiedVolumeNumber` | |
| `conditionalDiscountValue` | `ConditionalDiscountValue` | |
| `conditionalExpenseValue` | `ConditionalExpenseValue` | |
| `bugdetNatureCompanyId` | `BugdetNatureCompanyId` | |
| `bugdetNatureCode` | `BugdetNatureCode` | |
| `freightApportionment` | `FreightApportionment` | |
| `insuranceApportionment` | `InsuranceApportionment` | |
| `discountApportionment` | `DiscountApportionment` | |
| `expenseApportionment` | `ExpenseApportionment` | |
| `extraValue1Apportionment` | `ExtraValue1Apportionment` | |
| `extraValue2Apportionment` | `ExtraValue2Apportionment` | |
| `ctrcFreightApportionment` | `CTRCFreightApportionment` | |
| `materialDeductionApportionment` | `MaterialDeductionApportionment` | |
| `subcontractingDeductionApportionment` | `SubcontractingDeductionApportionment` | |
| `otherDeductionApportionment` | `OtherDeductionApportionment` | |
| `budgetUnitPrice` | `BudgetUnitPrice` | |
| `nFeServiceValue` | `NFeServiceValue` | |
| `warehouseCode` | `WarehouseCode` | |
| `heritageValue` | `HeritageValue` | |
| `costCenterDepartmentApportionmentValue` | `CostCenterDepartmentApportionmentValue` | |
| `replenishmentCost` | `ReplenishmentCost` | |
| `bReplenishmentCost` | `BReplenishmentCost` | |
| `thirdPartyFinancialValue` | `ThirdPartyFinancialValue` | |
| `isSubstituteProduct` | `IsSubstituteProduct` | |
| `unitPriceSelectionType` | `UnitPriceSelectionType` | |
| `financialValueApportionment` | `FinancialValueApportionment` | |
| `aplicationIntegration` | `AplicationIntegration` | |
| `complementaryFields` | `complementaryFields` | |

### Apenas no GET (itens)

| Campo GET | Observação |
|---|---|
| `heritageBaseDepreciationValue` | Calculado pelo sistema |
| `productFantasyName` | Nome fantasia — descritivo |
| `productCode` | Código do produto — descritivo |
| `productReducedCode` | Código reduzido — descritivo |
| `manufacturerProductNumber` | Número no fabricante |
| `manufacturerCode` | Código do fabricante |

### Apenas no POST (itens)

| Campo POST | Observação |
|---|---|
| `_expandables` | Metadado da API |
| `TaxNumber` | Número de imposto |
| `ProductTypeCode` | Tipo de produto |
| `FinancialOptionalTable3Code` | Tabela opcional financeira 3 |
| `FinancialOptionalTable4Code` | Tabela opcional financeira 4 |
| `FinancialOptionalTable5Code` | Tabela opcional financeira 5 |
| `CompositeProductId` | Produto composto |
| `ChargePercentage` | Percentual de encargo |
| `NCMIndex` | Índice NCM |
| `NCMId` | ID NCM |
| `CommercialRepresentativeCode` | Código do representante comercial |
| `ClassificationTable1Code` até `ClassificationTable5Code` | Tabelas de classificação 1 a 5 |
| `FinancialOptionalTable1Code` | Tabela opcional financeira 1 |
| `FinancialOptionalTable2Code` | Tabela opcional financeira 2 |
| `DiscountPercentage` | Percentual de desconto |
| `DiscountValue` | Valor de desconto |
| `ExpensePercentage` | Percentual de despesa |
| `ExpenseValue` | Valor de despesa |
| `MessageCode` | Código de mensagem |
| `ContractItemMeasurementSequentialNumber` | Número sequencial de medição do item contrato |
| `OfficinaObjectId` | ID do objeto da oficina |
| `GridId` | ID de grade |
| `Salesman1Code` | Código do vendedor 1 |
| `HeritageSiteCode` | Código do local de patrimônio |
| `ExportRegisterNumber` | Número do registro de exportação |
| `ExportRegisterDate` | Data do registro de exportação |
| `EditedTotalPrice` | Preço total editado |
| `CST` | Código CST |
| `BudgetDate` | Data do orçamento |
| `EnergyTelecomItemClassification` | Classificação energia/telecom |
| `CODIFCode` | Código CODIF |
| `ServiceProviderCityCode` | Código de cidade do prestador |
| `ServiceProviderStateCode` | UF do prestador |
| `LocalManagementFinancialValue` | Valor financeiro de gestão local |
| `ServiceCode` | Código de serviço |
| `LocalManagementUnitValue` | Valor unitário de gestão local |
| `IntegrationId` | ID de integração |
| `PriceTableId` | ID da tabela de preços |
| `PublicationCode` | Código de publicação |
| `BudgetGroupCode` | Código do grupo de orçamento |
| `FreeField` | Campo livre |
| `NatureCode` | Código de natureza |
| `NatureId` | ID da natureza |
| `PaymentTermCode` | Condição de pagamento do item |
| `Shelf` | Prateleira |
| `ContractId` | ID do contrato |
| `ContractItemSequentialNumber` | Número sequencial do item de contrato |
| `BillingInitialDate` | Data inicial de faturamento |
| `BillingFinalDate` | Data final de faturamento |
| `StockEffectFlag` | Flag de efeito em estoque |
| `BillingType` | Tipo de faturamento |
| `CostCenterCode` | Código do centro de custo |
| `DepartmentCode` | Código do departamento |
| `TransferFlag` | Flag de transferência |
| `Plate` | Placa |
| `InitialDate` | Data inicial |
| `FinalDate` | Data final |
| `EstimationInitialDate` | Data inicial de estimativa |
| `Status` | Status do item |
| `BlockObject` | Bloquear objeto |
| `RebillingFlag` | Flag de refaturamento |
| `DestinyContractId` | ID do contrato destino |
| `DestinyContractItemSequentialNumber` | Número sequencial do item de contrato destino |
| `ProjectId` | ID do projeto |
| `TaskId` | ID da tarefa |
| `ProductCodeValue` | Valor do código do produto |
| `ProductCodeType` | Tipo do código do produto |
| `OrderUnitQuantity` | Quantidade unitária de pedido |
| `ECFTax` | Imposto ECF |
| `TOPContractId` | ID do contrato TOP |
| `ContractBillingDate` | Data de cobrança do contrato |
| `ConsignedProduct` | Produto em consignação |
| `KBlockSubstituteProductId` | ID de produto substituto KBlock |
| `TOPRetentionValue` | Valor de retenção TOP |
| `TOPRetentionPercentage` | Percentual de retenção TOP |
| `BrandCompanyId` | Empresa da marca |
| `BrandId` | ID da marca |
| `DeductionValue` | Valor de dedução |
| `DeductionPercentage` | Percentual de dedução |
| `TaxableQuantity` | Quantidade tributável |
| `SigaMNTHeritageCode` | Código de patrimônio SigaMNT |
| `InterestRate` | Taxa de juros |
| `ReturnDate` | Data de devolução |
| `TaxRuleId` | ID da regra fiscal |

---

## 3. SUB-ARRAYS DOS ITENS

### 3.1 costCenterApportionments / CostCenterApportionments

| GET | POST | Observação |
|---|---|---|
| `companyId` | `CompanyId` | |
| `apportionmentId` | `ApportionmentId` | |
| `movementId` | `MovementId` | |
| `movementItemSequentialId` | `MovementItemSequentialId` | |
| `costCenterCode` | `CostCenterCode` | |
| `percentage` | `Percentage` | |
| `projectId` | `ProjectId` | |
| `taskId` | `TaskId` | |
| `costCenterName` | `CostCenterName` | |
| `projectCode` | `ProjectCode` | |
| `taskCode` | `TaskCode` | |
| — | `Quantity` | Apenas no POST |
| — | `Value` | Apenas no POST |
| — | `History` | Apenas no POST |
| — | `BudgetGroupCode` | Apenas no POST |

### 3.2 departmentApportionments / DepartmentApportionments

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementItemSequentialId` | |
| `BranchId` | |
| `DepartmentCode` | |
| `Value` | |
| `Percentage` | |
| `DepartmentName` | |

### 3.3 taxes / Taxes (dentro dos itens)

| GET | POST | Observação |
|---|---|---|
| `companyId` | `CompanyId` | |
| `movementId` | `MovementId` | |
| `movementItemSequentialId` | `MovementItemSequentialId` | |
| `taxId` | `TaxId` | |
| `calculationBasis` | `CalculationBasis` | |
| `aliquot` | `Aliquot` | |
| `value` | `Value` | |
| `reductionFactory` | `ReductionFactory` | |
| `taxSubstitutionFactor` | `TaxSubstitutionFactor` | |
| `calculatedCalculationBasis` | `CalculatedCalculationBasis` | |
| `edited` | `Edited` | |
| `icmsPartialDeferralPercent` | `ICMSPartialDeferralPercent` | |
| `fullBase` | `FullBase` | |
| — | `ReferenceUnitCode` | Apenas no POST |
| — | `RetainedJudicialProcessValue` | Apenas no POST |
| — | `ExemptValue` | Apenas no POST |
| — | `RetentionCode` | Apenas no POST |
| — | `CollectionType` | Apenas no POST |
| — | `BaseTaxCode` | Apenas no POST |
| — | `TaxSituation` | Apenas no POST |
| — | `BCMode` | Apenas no POST |
| — | `AliquotByValue` | Apenas no POST |
| — | `SocialContributionCode` | Apenas no POST |
| — | `YieldType` | Apenas no POST |
| — | `TaxationForm` | Apenas no POST |
| — | `FullAliquot` | Apenas no POST |
| — | `AliquotReductionPercent` | Apenas no POST |
| — | `DeferralPercent` | Apenas no POST |
| — | `TaxDeferred` | Apenas no POST |
| — | `TaxClassification` | Apenas no POST |
| — | `PresumedCreditClassificatioCode` | Apenas no POST |
| — | `PresumedCreditPercentage` | Apenas no POST |
| — | `PresumedCreditValue` | Apenas no POST |
| — | `ICMSExemptionReason` | Apenas no POST |
| — | `NFSEOperationNature` | Apenas no POST |
| — | `IPIContextCode` | Apenas no POST |
| — | `DifferentialICMSCalculationBasis` | Apenas no POST |
| — | `ExemptedICMSValue` | Apenas no POST |
| — | `RetainedSubcontractingValue` | Apenas no POST |
| — | `ExemptedICMSCalculationBasis` | Apenas no POST |
| — | `AliquotReductionGov` | Apenas no POST |
| — | `EffectiveAliquotGov` | Apenas no POST |

### 3.4 fiscal / Fiscal (dentro dos itens)

| GET | POST | Observação |
|---|---|---|
| `companyId` | `CompanyId` | |
| `movementId` | `MovementId` | |
| `movementItemSequentialId` | `MovementItemSequentialId` | |
| `contractedQuantity` | `ContractedQuantity` | |
| `approximateTotalTaxValue` | `ApproximateTotalTaxValue` | |
| `paaAcquisition` | `PAAAcquisition` | |
| `poebTaxable` | — | Apenas no GET |
| — | `ImportAdditionNumber` | Apenas no POST |
| — | `ImportAdditionItemSequentialNumber` | Apenas no POST |
| — | `CustomsDiscountValue` | Apenas no POST |
| — | `CustomsExpenseValue` | Apenas no POST |
| — | `ExportMemoNumber` | Apenas no POST |
| — | `ThirdPartyCustomerVendorCode` | Apenas no POST |
| — | `FreightNatureIndicator` | Apenas no POST |
| — | `IBPTTotalMunicipalTaxValue` | Apenas no POST |
| — | `SPEDAccountingAccount` | Apenas no POST |
| — | `NFeProductAdditionalInformation` | Apenas no POST |
| — | `MerchandiseSituation` | Apenas no POST |
| — | `ShippingKnowledge` | Apenas no POST |
| — | `TelephoneTerminalQualificationStateCode` | Apenas no POST |
| — | `RevenueType` | Apenas no POST |
| — | `ThirdPartyCustomerVendorCompanyId` | Apenas no POST |
| — | `CIAPMovementType` | Apenas no POST |
| — | `CollectCityCode` | Apenas no POST |
| — | `CollectStateCode` | Apenas no POST |
| — | `DeliveryCityCode` | Apenas no POST |
| — | `DeliveryStateCode` | Apenas no POST |
| — | `VehiclePlate` | Apenas no POST |
| — | `VehiclePlateStateCode` | Apenas no POST |
| — | `RevenueNature` | Apenas no POST |
| — | `CreditBaseCode` | Apenas no POST |
| — | `CreditTypeCode` | Apenas no POST |
| — | `RecopiNumber` | Apenas no POST |
| — | `IBPTTotalFederalTaxValue` | Apenas no POST |
| — | `IBPTTotalStateTaxValue` | Apenas no POST |
| — | `IBPTKey` | Apenas no POST |
| — | `ThirdPartyBranchId` | Apenas no POST |
| — | `OrderItemNumber` | Apenas no POST |
| — | `OrderNumber` | Apenas no POST |
| — | `ReinfTransferType` | Apenas no POST |
| — | `SPEDAccountingAccountCompanyId` | Apenas no POST |

### 3.5 relatedItem / RelatedItem

| GET | POST | Observação |
|---|---|---|
| `originMovementCompanyId` | `OriginMovementCompanyId` | |
| `originMovementId` | `OriginMovementId` | |
| `originMovementItemSequentialId` | `OriginMovementItemSequentialId` | |
| `destinyMovementCompanyId` | `DestinyMovementCompanyId` | |
| `destinyMovementId` | `DestinyMovementId` | |
| `destinyMovementItemSequentialId` | `DestinyMovementItemSequentialId` | |
| `quantity` | `Quantity` | |
| — | `ReceivedValue` | Apenas no POST |
| — | `MeasureUnitCode` | Apenas no POST |

### 3.6 itemLots / ItemLots

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementItemSequentialId` | |
| `LotId` | |
| `Quantity` | |
| `SortedQuantity` | |
| `ReceivableQuantity` | |
| `LotNumber` | |

**ItemLots[].RelatedLot[]:**

| POST | Observação |
|---|---|
| `OriginCompanyId` | |
| `DestinyCompanyId` | |
| `OriginMovementId` | |
| `DestinyMovementId` | |
| `OriginMovementItemSequentialId` | |
| `DestinyMovementItemSequentialId` | |
| `OriginLotId` | |
| `DestinyLotId` | |
| `Quantity` | |

### 3.7 itemGrids / ItemGrids

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementItemSequentialId` | |
| `ProductId` | |
| `GridCode` | |
| `GridItemSequentialNumber` | |
| `Quantity` | |
| `ReceivableQuantity` | |
| `SortedQuantity` | |
| `ItemGridCode` | |

**ItemGrids[].RelatedGrid[]:**

| POST | Observação |
|---|---|
| `OriginCompanyId` | |
| `DestinyCompanyId` | |
| `OriginMovementId` | |
| `DestinyMovementId` | |
| `OriginMovementItemSequentialId` | |
| `DestinyMovementItemSequentialId` | |
| `OriginProductId` | |
| `DestinyProductId` | |
| `OriginGridCode` | |
| `DestinyGridCode` | |
| `OriginGridItemSequentialNumber` | |
| `DestinyGridItemSequentialNumber` | |
| `Quantity` | |

### 3.8 itemSerialNumber / ItemSerialNumber

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementItemSequentialId` | |
| `ProductId` | |
| `SerialNumber` | |
| `Pending` | |

### 3.9 itemHeritage / ItemHeritage

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementItemSequentialId` | |
| `HeritageCode` | |
| `HeritageSiteCode` | |

### 3.10 siscoServFitting / SiscoServFitting

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementItemSequentialId` | |
| `FittingId` | |
| `RCNumber` | |

### 3.11 reserves / Reserves

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementItemSequentialId` | |
| `ProductId` | |
| `Type` | |
| `ReserveId` | |
| `Quantity` | |
| `Status` | |

### 3.12 exportRelatedItem / ExportRelatedItem

> Array vazio no GET. Mesma estrutura de RelatedItem no POST:
`OriginMovementId`, `OriginMovementItemSequentialId`, `OriginMovementCompanyId`, `DestinyMovementId`, `DestinyMovementItemSequentialId`, `DestinyMovementCompanyId`, `Quantity`, `ReceivedValue`, `MeasureUnitCode`

### 3.13 linkedItem / LinkedItem

> Array vazio no GET. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `OriginMovementId` | |
| `DestinyMovementId` | |
| `LinkedValue` | |
| `MovementItemSequentialId` | |
| `Status` | |

### 3.14 exportMemo / ExportMemo

> Array vazio no GET. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementItemSequentialId` | |
| `OriginCompanyId` | |
| `OriginMovementId` | |
| `OriginMovementItemSequentialId` | |
| `Quantity` | |
| `ExportMemorandumNumber` | |
| `MeasureUnitCode` | |
| `MovementNumber` | |
| `MovementType` | |

### 3.15 judicialProcess / JudicialProcess (dentro dos itens)

> Array vazio no GET. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementItemSequentialId` | |
| `ProcessId` | |
| `ProcessNumber` | |
| `ProcessDescription` | |

---

## 4. ARRAYS DE NÍVEL RAIZ

### 4.1 payments / Payments

> Array vazio no GET de exemplo. Estrutura completa do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `PaymentSequentialId` | |
| `MovementId` | |
| `PeriodCode` | |
| `DebitCredit` | |
| `Value` | |
| `Description` | |
| `PaymentType` | |
| `RegisterDate` | |
| `PaymentFormId` | |
| `DueDate` | |
| `AgencyDigit` | |
| `Discharged` | |
| `MultiplePayment` | |
| `Dollar` | |
| `InstallmentType` | |
| `PlotQuantity` | |
| `CnpjCpf` | |
| `NaturalLegal` | |
| `CMC7` | |
| `Bank` | |
| `Agency` | |
| `CurrentAccount` | |
| `CurrentAccountDigit` | |
| `BankCheck` | |
| `BankCheckDigit` | |
| `NSU` | |
| `ReceiptDate` | |
| `Completion` | |
| `NetworkName` | |
| `Administrator` | |
| `EntryId` | |
| `CashAccountCompanyId` | |
| `CashAccount` | |
| `FreeField` | |
| `AdministrateTax` | |
| `IssuerName` | |
| `IssuerPhone` | |
| `CustomerVendorCompanyId` | |
| `CustomerVendor` | |
| `PaymentFormType` | |
| `DefaultCustomerVendorCompanyId` | |
| `DefaultCustomerVendorCode` | |
| `PaymentFormDescription` | |

### 4.2 costCenterApportionments / CostCenterApportionments (raiz)

| GET | POST | Observação |
|---|---|---|
| `companyId` | `CompanyId` | |
| `apportionmentId` | `ApportionmentId` | |
| `movementId` | `MovementId` | |
| `costCenterCode` | `CostCenterCode` | |
| `percentage` | `Percentage` | |
| `projectId` | `ProjectId` | |
| `taskId` | `TaskId` | |
| `costCenterName` | `CostCenterName` | |
| `projectCode` | `ProjectCode` | |
| `taskCode` | `TaskCode` | |
| — | `Value` | Apenas no POST |
| — | `History` | Apenas no POST |
| — | `BudgetGroupCode` | Apenas no POST |

### 4.3 departmentApportionments / DepartmentApportionments (raiz)

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `BranchId` | |
| `DepartmentCode` | |
| `Value` | |
| `Percent` | |
| `DepartmentName` | |

### 4.4 taxes / Taxes (raiz)

> Array vazio no GET. No POST raiz tem a mesma estrutura de `Items[].Taxes[]` — ver seção 3.3.
> **Nota:** No GET os impostos ficam apenas dentro dos itens; no POST existem tanto no item quanto na raiz.

### 4.5 fiscal / Fiscal (raiz)

| GET | POST | Observação |
|---|---|---|
| `companyId` | `CompanyId` | |
| `movementId` | `MovementId` | |
| `accreditedTaxpayer` | `AccreditedTaxpayer` | |
| `presentialOperation` | `PresentialOperation` | |
| `travelNumber` | `TravelNumber` | |
| `portExpenseValue` | `PortExpenseValue` | |
| `cargoExpenseValue` | `CargoExpenseValue` | |
| `navyFreightValue` | `NavyFreightValue` | |
| `taxedWeight` | `TaxedWeight` | |
| `terrestrianRateValue` | `TerrestrianRateValue` | |
| `adValoremRateValue` | `AdValoremRateValue` | |
| — | `ImportDeclarationNumber` | Apenas no POST |
| — | `ConsumptionEndDate` | Apenas no POST |
| — | `ConsumptionAccount` | Apenas no POST |
| — | `VehicleId` | Apenas no POST |
| — | `FreightNature` | Apenas no POST |
| — | `SingleCargoReference` | Apenas no POST |
| — | `NavigationType` | Apenas no POST |
| — | `TariffType` | Apenas no POST |
| — | `GrisValue` | Apenas no POST |
| — | `FiscalDocDigitalAuthenticationCode` | Apenas no POST |
| — | `ServiceCompetencyDate` | Apenas no POST |
| — | `DRAWBACK` | Apenas no POST |
| — | `ProvisionMode` | Apenas no POST |
| — | `StartDate` | Apenas no POST |
| — | `CompletedDate` | Apenas no POST |
| — | `NROSAT` | Apenas no POST |
| — | `ExportDeclarationNumber` | Apenas no POST |
| — | `ExportDeclarationDate` | Apenas no POST |
| — | `ExportNature` | Apenas no POST |
| — | `BillOfLading` | Apenas no POST |
| — | `BillOfLadingDate` | Apenas no POST |
| — | `BillOfLadingType` | Apenas no POST |
| — | `EndorsementDate` | Apenas no POST |
| — | `ImportDeclarationDate` | Apenas no POST |
| — | `MaterialDeductionValue` | Apenas no POST |
| — | `SubcontractingDeductionValue` | Apenas no POST |
| — | `OtherDeductionValue` | Apenas no POST |
| — | `ConsumptionClassId` | Apenas no POST |
| — | `BindingTypeId` | Apenas no POST |
| — | `TensionGroupId` | Apenas no POST |
| — | `ConsumptionUnity` | Apenas no POST |
| — | `ConsumptionStartDate` | Apenas no POST |
| — | `ReadingDate` | Apenas no POST |
| — | `PeakDemand` | Apenas no POST |
| — | `NoPeakDemand` | Apenas no POST |
| — | `TotalConsumption` | Apenas no POST |
| — | `CancellationReason` | Apenas no POST |
| — | `DispatchValue` | Apenas no POST |
| — | `DispatchNumber` | Apenas no POST |
| — | `ClearanceDate` | Apenas no POST |
| — | `UseTypeId` | Apenas no POST |
| — | `FinalConsumerOperation` | Apenas no POST |
| — | `DisembarrassmentSite` | Apenas no POST |
| — | `DisembarrassmenState` | Apenas no POST |
| — | `ImportNature` | Apenas no POST |
| — | `CreditStartDate` | Apenas no POST |
| — | `RevenueAdditionalInformation` | Apenas no POST |
| — | `ComplementaryTaxpayerInformation` | Apenas no POST |
| — | `VehicleType` | Apenas no POST |
| — | `OperationType` | Apenas no POST |
| — | `CNPJCPFServiceRecipient` | Apenas no POST |
| — | `NIFServiceRecipient` | Apenas no POST |
| — | `NoNIFServiceRecipient` | Apenas no POST |
| — | `NameServiceRecipient` | Apenas no POST |
| — | `MunicipalityCodeServiceRecipient` | Apenas no POST |
| — | `PostalCodeServiceRecipient` | Apenas no POST |
| — | `CountryCodeServiceRecipient` | Apenas no POST |
| — | `StateCodeServiceRecipient` | Apenas no POST |
| — | `StreetServiceRecipient` | Apenas no POST |
| — | `NumberServiceRecipient` | Apenas no POST |
| — | `AddressComplementServiceRecipient` | Apenas no POST |
| — | `NeighborhoodServiceRecipient` | Apenas no POST |
| — | `PhoneServiceRecipient` | Apenas no POST |
| — | `EmailServiceRecipient` | Apenas no POST |

### 4.6 fiscalService (raiz)

> Apenas no GET. Não tem equivalente direto no POST.

| GET | Observação |
|---|---|
| `companyId` | |
| `movementId` | |

### 4.7 nfe / NFe

| GET | POST | Observação |
|---|---|---|
| `companyId` | `CompanyId` | |
| `movementId` | `MovementId` | |
| `serviceValue` | `ServiceValue` | |
| `serviceDeduction` | `ServiceDeduction` | |
| `issAliquot` | `ISSAliquot` | casing diferente |
| `retainedISS` | `RetainedISS` | |
| `issValue` | `ISSValue` | casing diferente |
| `iptuCreditValue` | `IPTUCreditValue` | casing diferente |
| `calculationBasis` | `CalculationBasis` | |
| `edited` | `Edited` | |
| — | `ServiceCode` | Apenas no POST |
| — | `NFENumber` | Apenas no POST |
| — | `NFEVerificationCode` | Apenas no POST |
| — | `RegisterDate` | Apenas no POST |
| — | `RegisterHour` | Apenas no POST |
| — | `CancellationDate` | Apenas no POST |
| — | `GuideNumber` | Apenas no POST |
| — | `DischargeGuideDate` | Apenas no POST |
| — | `Discrimination` | Apenas no POST |

### 4.8 inputCTRC / InputCTRC

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `NFMovementId` | |
| `CTRCMovementId` | |
| `CNPJ` | |
| `IE` | |
| `StateCode` | |
| `CityCode` | |
| `SenderAddresseeCompanyName` | |

### 4.9 outputCTRC / OutputCTRC

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `BillSequentialNumber` | |
| `RegisterDate` | |
| `DocumentTypeCode` | |
| `DocumentSeries` | |
| `DocumentSubSeries` | |
| `DocumentNumber` | |
| `TotalValue` | |
| `CoveredMovementId` | |
| `CNPJ` | |
| `IE` | |
| `StateCode` | |
| `CityCode` | |
| `SenderAddresseeCompanyName` | |
| `MerchandiseValue` | |
| `VolumesNature` | |
| `Quantity` | |
| `Volumes` | |
| `Brand` | |
| `TransportedProductKind` | |
| `CargoNumber` | |
| `GrossWeigth` | |
| `NetWeigth` | |
| `NatureCode` | |
| `ICMSCalculationBasis` | |
| `ICMSTotalValue` | |
| `ICMSSTCalculationBasis` | |
| `ICMSSTTotalValue` | |
| `ProductsTotalValue` | |
| `NFEAccessKey` | |
| `CollectStateCode` | |
| `DeliveryStateCode` | |
| `CollectCityCode` | |
| `DeliveryCityCode` | |
| `IssuerCNPJ` | |
| `DocumentLinkType` | |
| `SecondBarCodeRegisterDate` | |
| `SecondBarCodeValue` | |
| `SecondBarCodeTaxSituation` | |
| `SecondBarCodeNFE` | |
| `CNPJCIOTCTE` | |
| `CIOTCTe` | |
| `ContainerId` | |
| `PaymentResponsibleName` | |
| `ResponsibleType` | |
| `Foreign` | |

**OutputCTRC[].HazardousCargo[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `NoteSequentialNumber` | |
| `HazardousCargoId` | |
| `UNNumber` | |
| `ProductShippingName` | |
| `SecondaryClassAndRisk` | |
| `PackageNumber` | |
| `ProductTotalQuantity` | |
| `VolumeTypeAndQuantity` | |

### 4.10 ctrc / CTRC

| GET | POST | Observação |
|---|---|---|
| `companyId` | `CompanyId` | |
| `movementId` | `MovementId` | |
| `billValue` | `BillValue` | |
| `apportionedValue` | `ApportionedValue` | |
| `billQuantity` | `BillQuantity` | |
| `apportionedBillQuantity` | `ApportionedBillQuantity` | |
| `apportionCTRCValue` | — | Apenas no GET |

### 4.11 transportData / TransportData

| GET | POST | Observação |
|---|---|---|
| `companyId` | `CompanyId` | |
| `movementId` | `MovementId` | |
| `withdrawMerchandise` | `WithdrawMerchandise` | |
| `cTeType` | `CTeType` | |
| `takerType` | `TakerType` | |
| `takerICMSTaxpayer` | `TakerICMSTaxpayer` | |
| `mdFeIssuerType` | `MDFeIssuerType` | |
| `bPeType` | `BPeType` | |
| `capacity` | `Capacity` | |
| `mdFeTransporterType` | `MDFeTransporterType` | |
| — | `DeliveryStateCode` | Apenas no POST |
| — | `DeliveryCityCode` | Apenas no POST |
| — | `CollectStateCode` | Apenas no POST |
| — | `CollectCityCode` | Apenas no POST |
| — | `SenderType` | Apenas no POST |
| — | `SenderCustomerVendorCompanyId` | Apenas no POST |
| — | `SenderCustomerVendorCode` | Apenas no POST |
| — | `SenderBranchId` | Apenas no POST |
| — | `AddresseeType` | Apenas no POST |
| — | `AddresseeCustomerVendorCompanyId` | Apenas no POST |
| — | `AddresseeCustomerVendorCode` | Apenas no POST |
| — | `AddresseeBranchId` | Apenas no POST |
| — | `RedispatchingCarrierCode` | Apenas no POST |
| — | `CollectCnpjCpf` | Apenas no POST |
| — | `CollectIE` | Apenas no POST |
| — | `CollectIM` | Apenas no POST |
| — | `DeliveryCnpjCpf` | Apenas no POST |
| — | `DeliveryIE` | Apenas no POST |
| — | `DeliveryIM` | Apenas no POST |
| — | `RedispatchingFreightType` | Apenas no POST |
| — | `CollectStreet` | Apenas no POST |
| — | `CollectStreetNumber` | Apenas no POST |
| — | `CollectAddressComplement` | Apenas no POST |
| — | `CollectNeighborhood` | Apenas no POST |
| — | `DeliveryStreet` | Apenas no POST |
| — | `DeliveryStreetNumber` | Apenas no POST |
| — | `DeliveryAddressComplement` | Apenas no POST |
| — | `DeliveryNeighborhood` | Apenas no POST |
| — | `CollectName` | Apenas no POST |
| — | `DeliveryName` | Apenas no POST |
| — | `CTeServiceType` | Apenas no POST |
| — | `DispatcherType` | Apenas no POST |
| — | `DispatcherCustomerVendorCompanyId` | Apenas no POST |
| — | `DispatcherCosutmerVendorCode` | Apenas no POST (typo na API) |
| — | `DispatcherBranchId` | Apenas no POST |
| — | `ReceiverType` | Apenas no POST |
| — | `ReceiverCustomerVendorCompanyId` | Apenas no POST |
| — | `ReceiverCustomerVendorCode` | Apenas no POST |
| — | `ReceiverBranchId` | Apenas no POST |
| — | `ForeignCollectCityCode` | Apenas no POST |
| — | `ForeignDeliveryCityCode` | Apenas no POST |
| — | `TakerCustomerVendorCompanyId` | Apenas no POST |
| — | `TakerCustomerVendorCode` | Apenas no POST |
| — | `CIOT` | Apenas no POST |
| — | `GlobalizedObservation` | Apenas no POST |
| — | `NegotiableIndicator` | Apenas no POST |
| — | `PeopleFreightageType` | Apenas no POST |
| — | `TravelDateTime` | Apenas no POST |
| — | `DisagreementDate` | Apenas no POST |
| — | `DeliveryZipCode` | Apenas no POST |
| — | `DeliveryCountryCode` | Apenas no POST |
| — | `DeliveryPhone` | Apenas no POST |
| — | `DeliveryEmail` | Apenas no POST |
| — | `DeliveryCustomerVendorCompanyId` | Apenas no POST |
| — | `DeliveryCustomerVendorCode` | Apenas no POST |
| — | `CollectZipCode` | Apenas no POST |
| — | `CollectCountryCode` | Apenas no POST |
| — | `CollectPhone` | Apenas no POST |
| — | `CollectEmail` | Apenas no POST |
| — | `CollectCustomerVendorCompanyId` | Apenas no POST |
| — | `CollectCustomerVendorCode` | Apenas no POST |

### 4.12 norm / Norm

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `ReferencedNormId` | |

### 4.13 cargoComponent / CargoComponent

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `VehiclePlateStateCode` | |
| `VehiclePlate` | |
| `CargoNumber` | |
| `GrossWeight` | |
| `NetWeight` | |

### 4.14 thirdPartyNF / ThirdPartyNF

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `ThirdPartyNFId` | |
| `DocumentTypeCode` | |
| `Number` | |
| `Series` | |
| `SubSeries` | |
| `IssuerCnpjCpfCEI` | |
| `IssuerStateCode` | |
| `ReferenceReason` | |
| `Observation` | |
| `TotalValue` | |
| `IE` | |
| `RegisterDate` | |

### 4.15 safetyDevice / SafetyDevice

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `SafetyDeviceCode` | |

### 4.16 documentAuthorization / DocumentAuthorization

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `ResponsibleSequentialNumber` | |
| `ResponsibleCode` | |

### 4.17 judicialProcess / JudicialProcess (raiz)

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `Sequential` | |
| `ReferencedProcessId` | |
| `FiscalEntryId` | |

### 4.18 serviceOrder / ServiceOrder

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `ProcessingStatus` | |
| `ServiceOrderId` | |
| `SubStatusId` | |
| `ScheduleDate` | |
| `Remodeling` | |
| `Plan` | |
| `ObjectId` | |
| `HistoryId` | |
| `CancelationReasonCode` | |
| `ResponsiblePlateCompanyId` | |
| `ResponsiblePlate` | |
| `ReformProcessCode` | |
| `ObjectTypeId` | |
| `ThirdPartyServiceOrder` | |
| `EmailSent` | |
| `SendingDate` | |

### 4.19 relatedMovement / RelatedMovement

| GET | POST | Observação |
|---|---|---|
| `originCompanyId` | `OriginCompanyId` | |
| `originMovementId` | `OriginMovementId` | |
| `destinyCompanyId` | `DestinyCompanyId` | |
| `destinyMovementId` | `DestinyMovementId` | |
| `relationType` | `RelationType` | |
| `processId` | `ProcessId` | |
| — | `ReceivedValue` | Apenas no POST |

### 4.20 exportRelatedMovement / ExportRelatedMovement

> Array vazio no GET de exemplo. Mesma estrutura de RelatedMovement no POST.

### 4.21 linkedMovement / LinkedMovement

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `MovementValue` | |
| `LinkedValue` | |
| `LinkType` | |

### 4.22 eaiIntegration / EAIIntegration

> Array vazio no GET de exemplo. Estrutura do POST:

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `IntegrationStatus` | |
| `TriggerContext` | |
| `AppropriateMovementIn` | |
| `GlobalId` | |
| `IsTotvsMessage` | |
| `GenerateTriggerTotvsMessage` | |

### 4.23 electronicInvoiceFreeFields (raiz)

> Array vazio no GET. **Não tem equivalente no POST.**

### 4.24 cTe / CTE

> Array vazio no GET de exemplo. Estrutura completa do POST:

**CTE[] (raiz):**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `CTEId` | |
| `Type` | |

**CTE[].Insurance[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `InsuranceSequentialId` | |
| `Responsible` | |
| `InsurerCode` | |
| `Policy` | |
| `MerchandiseValue` | |
| `Endorsement` | |
| `CTEId` | |
| `InsurerCompanyId` | |
| `InsurerId` | |
| `InsuranceResponsibleCNPJ` | |

**CTE[].Driver[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `MovementId` | |
| `CTEId` | |
| `DriverSequentialId` | |
| `CPF` | |
| `Name` | |

**CTE[].WaterborneTransport[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `NavigationAgencyCNPJ` | |
| `VesselType` | |
| `VesselCode` | |
| `TravelNumber` | |
| `OriginPortCode` | |
| `DestinyPortCode` | |
| `NavigationType` | |
| `AFRMMCalculationBasis` | |
| `AFRMMValue` | |
| `ShipId` | |
| `Direction` | |
| `ShipIrin` | |

**CTE[].PredominantProduct[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `LoadingLatitude` | |
| `CargoType` | |
| `Description` | |
| `EANCode` | |
| `NCMCode` | |
| `LoadingZipCode` | |
| `LoadingLongitude` | |
| `UnloadingZipCode` | |
| `UnloadingLatitude` | |
| `UnloadingLongitude` | |

**CTE[].AirborneTransport[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `FlightNumber` | |
| `BoardingAerodrome` | |
| `LandingAerodrome` | |
| `FlightDate` | |
| `DraftNumber` | |
| `OperationalNumber` | |
| `CargoNatureDimension` | |
| `Class` | |
| `TariffCode` | |
| `TariffValue` | |
| `Nationality` | |
| `Registration` | |

**CTE[].Ferry[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `FerrySequentialId` | |
| `Ferry` | |

**CTE[].PreviousDocumentIssuer[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `MovementId` | |
| `IssuerSequentialId` | |
| `CNPJCPF` | |
| `IE` | |
| `Name` | |
| `StateCode` | |

**CTE[].PreviousDocumentIssuer[].Documents[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `MovementId` | |
| `FiscalDocumentNumber` | |
| `RegisterDate` | |
| `NFeAccesskey` | |
| `IssuerSequentialId` | |
| `DocumentSequentialId` | |
| `OriginDocumentType` | |
| `Series` | |
| `SubSeries` | |

**CTE[].HazardousCargo[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `ProductTotalQuantity` | |
| `VolumeTypeAndQuantity` | |
| `FlashPoint` | |
| `DangerousItemsTotalQuantity` | |
| `AirborneTransportMeasureUnit` | |
| `HazardousCargoId` | |
| `UNNumber` | |
| `ProductShippingName` | |
| `SecondaryClassAndRisk` | |
| `PackageNumber` | |
| `MeasureUnit` | |

**CTE[].RouteInformation[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `StateCode` | |
| `RouteStateOrder` | |

**CTE[].CargoFlow[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `OriginCode` | |
| `DestinyCode` | |
| `RouteCode` | |

**CTE[].CargoFlow[].CrossingPoints[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `CrossingPointSequentialId` | |
| `CrossingPointCode` | |

**CTE[].FreightPaymentInformation[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `BankCode` | |
| `AgencyCode` | |
| `EletronicPaymentInstitutionCNPJ` | |
| `FreightPaymentResponsibleType` | |
| `FreightPaymentSequentialId` | |
| `FreightPaymentResponsibleName` | |
| `FreightPaymentResponsibleId` | |
| `ContractValue` | |
| `PaymentFormIndicator` | |

**CTE[].FreightPaymentInformation[].Components[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `FreightPaymentSequentialId` | |
| `FreightComponentSequentialId` | |
| `Type` | |
| `Value` | |
| `OtherComponentDescription` | |

**CTE[].FreightPaymentInformation[].InstallmentPayment[]:**

| POST | Observação |
|---|---|
| `CompanyId` | |
| `CTeId` | |
| `FreightPaymentSequentialId` | |
| `FreightInstallmentPaymentSequentialId` | |
| `PlotNumber` | |
| `PlotDueDate` | |
| `PlotValue` | |

---

## 5. TYPOS CONHECIDOS NA API TOTVS

| Campo | Problema |
|---|---|
| `RecievedValue` (POST raiz) | Deveria ser `ReceivedValue` |
| `DispatcherCosutmerVendorCode` (TransportData) | Deveria ser `DispatcherCustomerVendorCode` |
| `GrossWeigth` / `NetWeigth` (OutputCTRC) | Deveria ser `GrossWeight` / `NetWeight` |

---

## 6. RESUMO DE CONTAGEM

| Seção | Campos GET | Campos POST |
|---|---|---|
| Cabeçalho raiz | 85 | 183 |
| Itens | 71 | 127 |
| Sub-arrays dos itens | ~60 | ~160 |
| Arrays raiz (fiscal, nfe, ctrc, etc.) | ~30 | ~270 |
| **Total estimado** | **~246** | **~740** |
