using System.Text;
////using LinkERP.BLL.Account;
////using LinkERP.BLL.Account.Interfaces;
//using LinkERP.BLL.INV;
//using LinkERP.BLL.INV.Interfaces;
//using LinkERP.BLL.INV.Inventory;
//using LinkERP.BLL.INV.Inventory.Interfaces;
//using LinkERP.BLL.INV.Inventory.Inventory_Unit_Of_Measure_Conversions;
//using LinkERP.BLL.INV.Inventory.Inventory_Unit_Of_Measure_Conversions.Interfaces;

//using LinkERP.BLL.INV.Inventory.Inventory_Vendor;
//using LinkERP.BLL.INV.Inventory.Inventory_Vendor.Interfaces;
using LinkERP.BLL.SHARED;
using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.BLL.SYS;
using LinkERP.BLL.SYS.Interfaces;
////using LinkERP.DAL.Account;
////using LinkERP.DAL.Account.Interfaces;
//using LinkERP.DAL.INV;
//using LinkERP.DAL.INV.Interfaces;
//using LinkERP.DAL.INV.Inventory;
//using LinkERP.DAL.INV.Inventory.Interfaces;

//using LinkERP.DAL.INV.Inventory.Inventory_Vendor;
//using LinkERP.DAL.INV.Inventory.Inventory_Vendor.Interfaces;
//using LinkERP.DAL.INV.Inventory.Inventory_Unit_Of_Measure_Conversions;
//using LinkERP.DAL.INV.Inventory.Inventory_Unit_Of_Measure_Conversions.Interfaces;
using LinkERP.DAL.SHARED;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.DAL.SYS;
using LinkERP.DAL.SYS.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
//using LinkERP.DAL.INV.Inventory.Inventory_Barcode.Interfaces;
//using LinkERP.DAL.INV.Inventory.Inventory_Barcode;
//using LinkERP.BLL.INV.Inventory.Inventory_Barcode.Interfaces;
//using LinkERP.BLL.INV.Inventory.Inventory_Barcode;
//using LinkERP.DAL.INV.Inventory.Inventory_ProductPrice.Interfaces;
//using LinkERP.DAL.INV.Inventory.Inventory_ProductPrice;
//using LinkERP.BLL.INV.Inventory.Inventory_ProductPrice.Interfaces;
//using LinkERP.BLL.INV.Inventory.Inventory_ProductPrice;
//using LinkERP.DAL.INV.Inventory.Inventory_Stock_Allocation_Details.Interfaces;
//using LinkERP.DAL.INV.Inventory.Inventory_Stock_Allocation_Details;
//using LinkERP.BLL.INV.Inventory.Inventory_Stock_Allocation_Details.Interfaces;
//using LinkERP.BLL.INV.Inventory.Inventory_Stock_Allocation_Details;
//using LinkERP.BLL.INV.Inventory.Inventory_WareHouse_Price.Interfaces;
//using LinkERP.BLL.INV.Inventory.Inventory_WareHouse_Price;
//using LinkERP.DAL.INV.Inventory.Inventory_WareHouse_Price;
//using LinkERP.DAL.INV.Inventory.Inventory_WareHouse_Price.Interfaces;
//using LinkERP.DAL.INV.Inventory.Inventory_Kit.Interfaces;
//using LinkERP.DAL.INV.Inventory.Inventory_Kit;
//using LinkERP.BLL.INV.Inventory.Inventory_Kit;
//using LinkERP.BLL.INV.Inventory.Inventory_Kit.Interfaces;
//using LinkERP.DAL.INV.Inventory.Inventory_DebtorPrice;
//using LinkERP.DAL.INV.Inventory.Inventory_DebtorPrice.Interfaces;
//using LinkERP.BLL.INV.Inventory.Inventory_DebtorPrice;
//using LinkERP.BLL.INV.Inventory.Inventory_DebtorPrice.Interfaces;
using LinkERP.DAL.Account.Interfaces;
using LinkERP.DAL.Account;
using LinkERP.BLL.Account.Interfaces;
using LinkERP.BLL.Account;
//using LinkERP.BLL.PUR.Interfaces;
//using LinkERP.DAL.PUR.Interfaces;
//using LinkERP.DAL.PUR;
//using LinkERP.BLL.PUR;
//using LinkERP.DAL.PUR.Requisition.RequisitionApprovalLogs;
//using LinkERP.DAL.PUR.Requisition.RequisitionApprovalLogs.Interfaces;
//using LinkERP.BLL.PUR.Requisition.RequisitionApprovalLogs;
//using LinkERP.DAL.PUR.InternalTransfers.Interfaces;
//using LinkERP.DAL.PUR.InternalTransfers;
//using LinkERP.BLL.PUR.InternalTransfers.Interfaces;
//using LinkERP.BLL.PUR.InternalTransfers;
//using LinkERP.DAL.PUR.RequisitionDetails.Interfaces;
//using LinkERP.BLL.PUR.RequisitionDetails.Interfaces;
//using LinkERP.BLL.PUR.RequisitionDetails;
//using LinkERP.DAL.PUR.RequisitionDetails;
//using LinkERP.DAL.PUR.RequitionQuotationAnalysis.Interfaces;
//using LinkERP.BLL.PUR.RequitionQuotationAnalysis;
//using LinkERP.DAL.PUR.RequitionQuotationAnalysis;
//using LinkERP.BLL.PUR.RequitionQuotationAnalysis.Interfaces;
//using LinkERP.DAL.INV.Make.Interfaces;
//using LinkERP.BLL.INV.Make.Interfaces;
//using LinkERP.DAL.INV.Make;
//using LinkERP.BLL.INV.Make;
//using LinkERP.DAL.INV.Make.MakeModel.Interfaces;
//using LinkERP.BLL.INV.Make.MakeModel.interfaces;
//using LinkERP.DAL.INV.Make.MakeModel;
//using LinkERP.BLL.INV.Make.MakeModel;
//using LinkERP.DAL.INV.Make.Series.Interfaces;
//using LinkERP.BLL.INV.Make.Series.interfaces;
//using LinkERP.DAL.INV.Make.Series;
//using LinkERP.BLL.INV.Make.Series;
//using LinkERP.DAL.INV.Make.Engine.Interfaces;
//using LinkERP.DAL.INV.Make.Engine;
//using LinkERP.BLL.INV.Make.Engine.Interfaces;
//using LinkERP.BLL.INV.Make.Engine;
//using LinkERP.DAL.INV.Inventory_Transfer.Inventory_Transfer_Detail.Interfaces;
//using LinkERP.DAL.INV.Inventory_Transfer.Inventory_Transfer_Detail;
//using LinkERP.BLL.INV.Inventory_Transfer_Detail.Interfaces;
//using LinkERP.BLL.INV.Inventory_Transfer_Detail;
//using LinkERP.DAL.INV.Inventory.Inventory_Automative.Interfaces;
//using LinkERP.DAL.INV.Inventory.Inventory_Automative;
//using LinkERP.BLL.INV.Inventory.Inventory_Automative.Interfaces;
//using LinkERP.BLL.INV.Inventory.Inventory_Automative;
//using LinkERP.BLL.INV.Make.Year;
//using LinkERP.DAL.INV.Make.Year.Interfaces;
//using LinkERP.BLL.INV.Make.Year.Interfaces;
//using LinkERP.DAL.INV.Make.Year;
//using LinkERP.DAL.INV.Inventory_Transfer.Interfaces;
//using LinkERP.DAL.INV.Inventory_Transfer;
//using LinkERP.DAL.INV.Inventory.InventoryImage;
//using LinkERP.DAL.INV.Inventory.InventoryImage.Interfaces;
//using LinkERP.BLL.INV.Inventory.InventoryImage.Interfaces;
//using LinkERP.BLL.INV.Inventory.InventoryImage;
//using LinkERP.BLL.PUR.PurchaseTemplate.PurchaseTemplateDetail.Interfaces;
//using LinkERP.BLL.PUR.PurchaseTemplate.PurchaseTemplateDetail;
//using LinkERP.DAL.PUR.PurchaseTemplate.PurchaseTemplateDetail;
//using LinkERP.DAL.PUR.PurchaseTemplate.PurchaseTemplateDetail.Interfaces;
//using LinkERP.DAL.INV.InventoryAdjustment.Interfaces;
//using LinkERP.DAL.INV.InventoryAdjustment;
//using LinkERP.BLL.INV.InventoryAdjustment.Interfaces;
//using LinkERP.BLL.INV.InventoryAdjustment;
//using LinkERP.DAL.INV.Inventory_StockTake.Interfaces;
//using LinkERP.BLL.INV.Inventory_StockTake.Interfaces;
//using LinkERP.DAL.INV.Inventory_StockTake;
//using LinkERP.BLL.INV.Inventory_StockTake;
//using LinkERP.DAL.INV.Inventory_StockTake.Inventory_StockTakeDetail;
//using LinkERP.BLL.INV.Inventory_StockTake.Inventory_StockTakeDetail;
//using LinkERP.DAL.PUR.PurchaseMain.Interfaces;
//using LinkERP.DAL.PUR.PurchaseMain;
//using LinkERP.BLL.PUR.PurchaseMain.Interfaces;
//using LinkERP.BLL.PUR.PurchaseMain;
//using LinkERP.DAL.PUR.PurchaseGoodsReceiveNote;
//using LinkERP.BLL.PUR.PurchaseGoodsReceiveNote;
//using LinkERP.DAL.PUR.PurchaseTemplate.PurchaseInvoice;
//using LinkERP.BLL.PUR.PurchaseTemplate.PurchaseInvoice;
//using LinkERP.DAL.PUR.LandedCost;
//using LinkERP.BLL.PUR.LandedCost;
//using LinkERP.DAL.INV.InventoryStockTakeDetail.Interfaces;
//using LinkERP.DAL.INV.InventoryStockTakeDetail;
//using LinkERP.DAL.INV.Inventory.InventoryAdjustmentDetail;
//using LinkERP.BLL.INV.Inventory.InventoryAdjustmentDetail;
//using LinkERP.BLL.PUR.LandedCost.LandedCostPurchaseOrder;
//using LinkERP.DAL.PUR.LandedCost.LandedCostPurchaseOrder;
//using LinkERP.DAL.PUR.PurchaseMain.PurchaseMainDetail;
//using LinkERP.DAL.PUR.PurchaseMain.PurchaseMainDetail.Interfaces;
//using LinkERP.BLL.PUR.PurchaseMain.PurchaseMainDetail.Interfaces;
//using LinkERP.BLL.PUR.PurchaseMain.PurchaseMainDetail;
//using LinkERP.DAL.PUR.PurchaseGoodsReceiveNote.PurchaseGRNDetail;
//using LinkERP.BLL.PUR.PurchaseGoodsReceiveNote.PurchaseGRNDetail;
//using LinkERP.BLL.PUR.LandedCost.LandedCostInvoices;
//using LinkERP.DAL.PUR.PurchaseMain.PurchaseApprovalLogs;
//using LinkERP.BLL.PUR.PurchaseMain.PurchaseApprovalLogs;
//using LinkERP.DAL.PUR.LandedCost.LandedCostTaxableImports;
//using LinkERP.BLL.PUR.LandedCost.LandedCostTaxableImports;
//using LinkERP.DAL.PUR.LandedCost.LandedCostProductStyleMatrix;
//using LinkERP.BLL.PUR.LandedCost.LandedCostProductStyleMatrix;
//using LinkERP.DAL.PUR.LandedCost.LandedCostShipmentBookingDetail;
//using LinkERP.BLL.PUR.LandedCost.LandedCostShipmentBookingDetail;
//using LinkERP.DAL.PUR.LandedCost.LandedCostShipmentBooking;
//using LinkERP.BLL.PUR.LandedCost.LandedCostShipmentBooking;
using LinkERP.BLL.Reports.Interfaces;
using LinkERP.BLL.Reports;
using LinkERP.DAL.Reports.Interfaces;
using LinkERP.DAL.Reports;
using System;
using Microsoft.AspNetCore.SpaServices.AngularCli;
//using LinkERP.BLL.INV.InventoryTransfer.Interfaces;
//using LinkERP.BLL.INV.InventoryTransfer;
//using LinkERP.BLL.INV.InventoryStockDetail.Interfaces;
//using LinkERP.BLL.INV.InventoryStockDetail;
//using LinkERP.BLL.POS;
//using LinkERP.DAL.POS;
//using LinkERP.DAL.POS.Interfaces;
//using LinkERP.BLL.POS.Interfaces;
//using LinkERP.DAL.PUR.RequestForQuotation.Interfaces;
//using LinkERP.BLL.PUR.RequestForQuotation.Interfaces;
//using LinkERP.DAL.PUR.RequestForQuotation;
//using LinkERP.BLL.PUR.RequestForQuotation;
//using LinkERP.DAL.PUR.LandedCost.LandedCostImportCost;
//using LinkERP.BLL.PUR.LandedCost.LandedCostImportCost;
//using LinkERP.DAL.PUR.LandedCost.LandedCostShipmentLine;
//using LinkERP.BLL.PUR.LandedCost.LandedCostShipmentLine;
//using LinkERP.BLL.DOC.Interfaces;
//using LinkERP.BLL.DOC;
//using LinkERP.DAL.DOC.Interfaces;
//using LinkERP.DAL.DOC;
////using LinkERP.BLL.PUR.GoodsReceviedNote;
////using LinkERP.DAL.PUR.GoodsReceivedNote;
//using LinkERP.DAL.PUR.PurchaseTemplate.PurchaseInvoice.PurchaseInvoiceDetail;
//using LinkERP.BLL.PUR.PurchaseTemplate.PurchaseInvoice.PurchaseInvoiceDetail;
//using LinkERP.DAL.PUR.GoodsReceivedNote;
//using LinkERP.BLL.PUR.GoodsReceviedNote;

////using LinkERP.BLL.POS.Interfaces;
////using LinkERP.BLL.POS;
//using LinkERP.BLL.SOP;
//using LinkERP.BLL.SOP.Interfaces;
//using LinkERP.DAL.SOP;
//using LinkERP.DAL.SOP.Interfaces;
//using LinkERP.BLL.ACR.IACR;
//using LinkERP.DAL.ACR.IACR;
//using LinkERP.DAL.ACR;
//using LinkERP.BLL.ACR;
//using LinkERP.DAL.KitchenView.Interfaces;
//using LinkERP.DAL.KitchenView;
//using LinkERP.BLL.KitchenView.Interfaces;
//using LinkERP.BLL.KitchenView;
//using LinkERP.DAL.INV.Inventory.InventoryPriceChangeAudit;
//using LinkERP.BLL.INV.Inventory.InventoryPriceChangeAudit;

namespace LinkERP.Service
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("LinkEPR",
                builder =>
                {

                    builder.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            IdentityModelEventSource.ShowPII = true;

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);


            var key = Encoding.ASCII.GetBytes("AspireSoftwareDevelopment");
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddTransient<Helper.IAccountHelper, Helper.AccountHelper>();

            services.AddTransient<ICompanyRepository, CompanyRepository>();
            services.AddTransient<ICompanyService, CompanyService>();

            services.AddTransient<DAL.SYS.Interfaces.ICommonRepository, DAL.SYS.CommonRepository>();
            services.AddTransient<BLL.SYS.Interfaces.ICommonService, BLL.SYS.CommonService>();

            services.AddTransient<IRoleRepository, RoleRepository>();
            services.AddTransient<IRoleService, RoleService>();

            services.AddTransient<IRoleCompanyAccessRepository, RoleCompanyAccessRepository>();
            services.AddTransient<IRoleCompanyAccessService, RoleCompanyAccessService>();

            services.AddTransient<IRoleModuleAccessRepository, RoleModuleAccessRepository>();
            services.AddTransient<IRoleModuleAccessService, RoleModuleAccessService>();

            services.AddTransient<IRoleMenuAccessRepository, RoleMenuAccessRepository>();
            services.AddTransient<IRoleMenuAccessService, RoleMenuAccessService>();

            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IUserService, UserService>();

            services.AddTransient<IUserRolesService, UserRolesService>();
            services.AddTransient<IUserRolesRepository, UserRolesRepository>();

            services.AddTransient<ICountryStateRepository, CountryStateRepository>();
            services.AddTransient<ICountryStateService, CountryStateService>();

            services.AddTransient<IWorkFlowRepository, WorkFlowRepository>();
            services.AddTransient<IWorkFlowService, WorkFlowService>();

            services.AddTransient<ICountryStateCityRepository, CountryStateCityRepository>();
            services.AddTransient<ICountryStateCityService, CountryStateCityService>();

            services.AddTransient<ICountryRepository, CountryRepository>();
            services.AddTransient<ICountryService, CountryService>();

            services.AddTransient<IJobRepository, JobRepository>();
            services.AddTransient<IJobService, JobService>();

            services.AddTransient<IFrequencyRepository, FrequencyRepository>();
            services.AddTransient<IFrequencyService, FrequencyService>();

            services.AddTransient<IDocumentTemplateRepository, DocumentTemplateRepository>();
            services.AddTransient<IDocumentTemplateService, DocumentTemplateService>();

            services.AddTransient<IModuleRepository, ModuleRepository>();
            services.AddTransient<IModuleService, ModuleService>();

            services.AddTransient<IBankRepository, BankRepository>();
            services.AddTransient<IBankService, BankService>();

            services.AddTransient<IDocumentTemplateRepository, DocumentTemplateRepository>();
            services.AddTransient<IDocumentTemplateService, DocumentTemplateService>();

            //services.AddTransient<IWarehouseRepository, WarehouseRepository>();
            //services.AddTransient<IWarehouseService, WarehouseService>();

            //services.AddTransient<IInventoryPriceLevelRepository, InventoryPriceLevelRepository>();
            //services.AddTransient<IInventoryPriceLevelService, InventoryPriceLevelService>();

            services.AddTransient<INoteRepository, NoteRepository>();
            services.AddTransient<INoteService, NoteService>();

            services.AddTransient<IAttachmentsRepository, AttachmentsRepository>();
            services.AddTransient<IAttachmentsService, AttachmentsService>();

            //services.AddTransient<IProductStyleMatrixRepository, ProductStyleMatrixRepository>();
            //services.AddTransient<IProductStyleMatrixService, ProductStyleMatrixService>();

            //services.AddTransient<IProductStyleMatrixDetailRepository, ProductStyleMatrixDetailRepository>();
            //services.AddTransient<IProductStyleMatrixDetailService, ProductStyleMatrixDetailService>();

            services.AddTransient<IBankAccountRepository, BankAccountRepository>();
            services.AddTransient<IBankAccountService, BankAccountService>();

            //services.AddTransient<IWarehouseNextNumbersRepository, WarehouseNextNumbersRepository>();
            //services.AddTransient<IWarehouseNextNumberService, WarehouseNextNumberService>();

            services.AddTransient<IBankAccountRepository, BankAccountRepository>();
            services.AddTransient<IBankAccountService, BankAccountService>();

            //services.AddTransient<IWareHouseBinRepository, WareHouseBinRepository>();
            //services.AddTransient<IWareHouseBinService, WareHouseBinService>();

            //services.AddTransient<IPriceGroupsRepository, PriceGroupsRepository>();
            //services.AddTransient<IPriceGroupsService, PriceGroupsService>();

            services.AddTransient<IGenericMasterTable, GenericMasterTableRepository>();
            services.AddTransient<IGenericMasterTableService, GenericMasterTableService>();

            //services.AddTransient<IInventoryRepository, InventoryRepository>();
            //services.AddTransient<IInventoryService, InventoryService>();

            services.AddTransient<ICurrencyRepository, CurrencyRepository>();
            services.AddTransient<ICurrencyService, CurrencyService>();

            //services.AddTransient<IInventoryDetailRepository, InventoryDetailRepository>();
            //services.AddTransient<IInventoryDetailService, InventoryDetailService>();

            services.AddTransient<ITaxCodeRepository, TaxCodeRepository>();
            services.AddTransient<ITaxCodeService, TaxCodeService>();

            services.AddTransient<IDeleteRecordsRepository, DeleteRecordsRepository>();
            services.AddTransient<IDeleteRecordsService, DeleteRecordsService>();

            services.AddTransient<ITaxCodeDetailsRepository, TaxCodeDetailsRepository>();
            services.AddTransient<ITaxCodeDetailsService, TaxCodeDetailsService>();

            //services.AddTransient<DAL.INV.Interfaces.ICommonRepository, DAL.INV.CommonRepository>();
            //services.AddTransient<BLL.INV.Interfaces.ICommonService, BLL.INV.CommonService>();


            services.AddTransient<IGenricTablesLookupRepository, GenricTablesLookupRepository>();
            services.AddTransient<IGenricTablesLookupService, GenricTablesLookupService>();

            services.AddTransient<IBankAccountMappingRepository, BankAccountMappingRepository>();
            services.AddTransient<IBankAccountMappingService, BankAccountMappingService>();

            services.AddTransient<IWorkFlowApproversRepository, WorkFlowApproversRepository>();
            services.AddTransient<IWorkFlowApproversService, WorkFlowApproversService>();

            //services.AddTransient<IInventoryUnitOfMeasureConversionsRepository, InventoryUnitOfMeasureConversionsRepository>();
            //services.AddTransient<IInventoryUnitOfMeasureConversionsDataService, InventoryUnitOfMeasureConversionsService>();

            //services.AddTransient<IInventoryVendorRepository, InventoryVendorRepository>();
            //services.AddTransient<IInventoryVendorService, InventoryVendorService>();

            //services.AddTransient<IInventoryBarcodeRepository, InventoryBarcodeRepository>();
            //services.AddTransient<IInventoryBarcodeService, InventoryBarcodeService>();

            //services.AddTransient<IInventoryProductPriceRepository, InventoryProductPriceRepository>();
            //services.AddTransient<IInventoryProductPriceService, InventoryProductPriceService>();

            //services.AddTransient<IInventoryStockAllocationDetailsRepository, InventoryStockAllocationDetailsRepository>();
            //services.AddTransient<IInventoryStockAllocationDetailsService, InventoryStockAllocationDetailsService>();

            ////services.AddTransient<ITablesRepository, TablesRepository>();
            ////services.AddTransient<ITablesService, TablesService>();

            services.AddTransient<IAccountRepository, AccountRepository>();
            services.AddTransient<IAccountService, AccountService>();

            //services.AddTransient<IInventoryWareHousePriceRepository, InventoryWareHousePriceRepository>();
            //services.AddTransient<IInventoryWareHousePriceService, InventoryWareHousePriceService>();

            //services.AddTransient<IInventoryKitRepository, InventoryKitRepository>();
            //services.AddTransient<IInventoryKitService, InventoryKitService>();

            //services.AddTransient<IInventoryDebtorPriceRepository, InventoryDebtorPriceRepository>();
            //services.AddTransient<IInventoryDebtorPriceService, InventoryDebtorPriceService>();

            //services.AddTransient<IRequisitionRepository, RequisitionRepository>();
            //services.AddTransient<IRequisitionService, RequisitionService>();

            //services.AddTransient<IRequisitionDetailsRepository, RequisitionDetailsRepository>();
            //services.AddTransient<IRequisitionDetailsService, RequisitionDetailsService>();

            //services.AddTransient<IRequisitionApprovalLogsRepository, RequisitionApprovalLogsRepository>();
            //services.AddTransient<IRequisitionApprovalLogsService, RequisitionApprovalLogsService>();

            //services.AddTransient<ICommonPURRepository, CommonPURRepository>();
            //services.AddTransient<ICommonPURService, CommonPURService>();

            //services.AddTransient<IPurchaseTemplateRepository, PurchaseTemplateRepository>();
            //services.AddTransient<IPurchaseTemplateService, PurchaseTemplateService>();

            //services.AddTransient<IPurchaseTemplateDetailRepository, PurchaseTemplateDetailRepository>();
            //services.AddTransient<IPurchaseTemplateDetailService, PurchaseTemplateDetailService>();

            services.AddTransient<ISecurityPermissionsRepository, SecurityPermissionsRepository>();
            services.AddTransient<ISecurityPermissionsService, SecurityPermissionsService>();

            //services.AddTransient<IInventoryTransferRepository, InventoryTransferRepository>();
            //services.AddTransient<IInventoryTransferService, InventoryTransferService>();

            //services.AddTransient<IInternalTransfersRepository, InternalTransfersRepository>();
            //services.AddTransient<IInternalTransfersService, InternalTransfersService>();

            //services.AddTransient<IInventoryTransferDetailRepository, InventoryTransferDetailRepository>();
            //services.AddTransient<IInventoryTransferDetailService, InventoryTransferDetailService>();

            //services.AddTransient<IPurchaseMainRepository, PurchaseMainRepository>();
            //services.AddTransient<IPurchaseMainService, PurchaseMainService>();

            //services.AddTransient<IRequitionQuotationAnalysisRepository, RequitionQuotationAnalysisRepository>();
            //services.AddTransient<IRequitionQuotationAnalysisService, RequitionQuotationAnalysisService>();

            //services.AddTransient<IVendorPriceSchemeRepository, VendorPriceSchemeRepository>();
            //services.AddTransient<IVendorPriceSchemeService, VendorPriceSchemeService>();

            //services.AddTransient<IMakeRepository, MakeRepository>();
            //services.AddTransient<IMakeService, MakeService>();

            //services.AddTransient<IMakeModelRepository, MakeModelRepository>();
            //services.AddTransient<IMakeModelService, MakeModelService>();

            //services.AddTransient<ISeriesRepository, SeriesRepository>();
            //services.AddTransient<ISeriesService, SeriesService>();

            //services.AddTransient<IEngineRepository, EngineRepository>();
            //services.AddTransient<IEngineService, EngineService>();

            //services.AddTransient<IInventoryAutomativeRepository, InventoryAutomativeRepository>();
            //services.AddTransient<IInventoryAutomativeService, InventoryAutomativeService>();

            //services.AddTransient<IYearRepository, YearRepository>();
            //services.AddTransient<IYearService, YearService>();

            //services.AddTransient<IInventoryImageRepository, InventoryImageRepository>();
            //services.AddTransient<IInventoryImageService, InventoryImageService>();

            services.AddTransient<IPayTeamRepository, PayTeamRepository>();
            services.AddTransient<IPayTeamService, PayTeamService>();

            //services.AddTransient<IInventoryAdjustmentRepository, InventoryAdjustmentRepository>();
            //services.AddTransient<IInventoryAdjustmentService, InventoryAdjustmentService>();

            //services.AddTransient<IInventoryStockTakeRepository, InventoryStockTakeRepository>();
            //services.AddTransient<IInventoryStockTakeService, InventoryStockTakeService>();

            //services.AddTransient<IInventoryStockTakeDetailRepository, InventoryStockTakeDetailRepository>();
            //services.AddTransient<IInventoryStockTakeDetailService, InventoryStockTakeDetailService>();

            //services.AddTransient<IPurchaseMainRepository, PurchaseMainRepository>();
            //services.AddTransient<IPurchaseMainService, PurchaseMainService>();

            //services.AddTransient<IPurchaseInvoiceRepository, PurchaseInvoiceRepository>();
            //services.AddTransient<IPurchaseInvoiceService, PurchaseInvoiceService>();

            //services.AddTransient<ILandedCostRepository, LandedCostRepository>();
            //services.AddTransient<ILandedCostService, LandedCostService>();

            //services.AddTransient<IPurchaseGoodsReceiveNoteRepository, PurchaseGoodsReceiveNoteRepository>();
            //services.AddTransient<IPurchaseGoodsReceiveNoteService, PurchaseGoodsReceiveNoteService>();

            //services.AddTransient<IPurchaseGRNDetailsRepository, PurchaseGRNDetailsRepository>();
            //services.AddTransient<IPurchaseGRNDetailsService, PurchaseGRNDetailsService>();

            //services.AddTransient<IInventoryStockTakeDetailProductStyleMatrixRepository, InventoryStockTakeDetailProductStyleMatrixRepository>();
            //services.AddTransient<IInventoryStockTakeDetailProductStyleMatrixService, InventoryStockTakeDetailProductStyleMatrixService>();

            //services.AddTransient<IInventoryAdjustmentDetailRepository, InventoryAdjustmentDetailRepository>();
            //services.AddTransient<IInventoryAdjustmentDetailService, InventoryAdjustmentDetailService>();

            //services.AddTransient<IPurchaseMainDetailRepository, PurchaseMainDetailRepository>();
            //services.AddTransient<IPurchaseMainDetailService, PurcahseMainDetailService>();

            //services.AddTransient<ILandedCostPurchaseOrderRepository, LandedCostPurchaseOrderRepository>();
            //services.AddTransient<ILandedCostPurchaseOrderService, LandedCostPurchaseOrderService>();

            //services.AddTransient<IPurchaseGRNDetailsRepository, PurchaseGRNDetailsRepository>();
            //services.AddTransient<IPurchaseGRNDetailsService, PurchaseGRNDetailsService>();

            //services.AddTransient<ILandedCostInvoicesRepository, LandedCostInvoicesRepository>();
            //services.AddTransient<ILandedCostInvoicesService, LandedCostInvoicesService>();

            //services.AddTransient<ILandedCostShipmentLineRepository, LandedCostShipmentLineRepository>();
            //services.AddTransient<ILandedCostShipmentLineService, LandedCostShipmentLineService>();

            //services.AddTransient<IPurchaseApprovalLogsRepository, PurchaseApprovalLogsRepository>();
            //services.AddTransient<IPurchaseApprovalLogsService, PurchaseApprovalLogsService>();

            //services.AddTransient<ILandedCostTaxableImportsRepository, LandedCostTaxableImportsRepository>();
            //services.AddTransient<ILandedCostTaxableImportsService, LandedCostTaxableImportsService>();

            //services.AddTransient<ILandedCostShipmentBookingProductStyleMatrixRepository, LandedCostShipmentBookingProductStyleMatrixRepository>();
            //services.AddTransient<ILandedCostShipmentBookingProductStyleMatrixService, LandedCostShipmentBookingProductStyleMatrixService>();

            //services.AddTransient<ILandedCostShipmentBookingDetailRepository, LandedCostShipmentBookingDetailRepository>();
            //services.AddTransient<ILandedCostShipmentBookingDetailService, LandedCostShipmentBookingDetailService>();

            //services.AddTransient<ILandedCostShipmentBookingRepository, LandedCostShipmentBookingRepository>();
            //services.AddTransient<ILandedCostShipmentBookingService, LandedCostShipmentBookingService>();

            services.AddTransient<IUserProfileService, UserProfileService>();
            services.AddTransient<IUserProfileRepository, UserProfileRepository>();

            services.AddTransient<IConfigurationService, ConfigurationService>();
            services.AddTransient<IConfigurationRepository, ConfigurationRepository>();

            services.AddTransient<IConfigurationService, ConfigurationService>();
            services.AddTransient<IConfigurationRepository, ConfigurationRepository>();

            //services.AddTransient<IDebtorService, DebtorService>();
            //services.AddTransient<IDebtorRepository, DebtorRepository>();

            //services.AddTransient<IVendorRepository, VendorRepository>();
            //services.AddTransient<IVendorService, VendorService>();

            services.AddTransient<IReportsBaseService, ReportsBaseService>();
            services.AddTransient<IReportsBaseRepository, ReportsBaseRepository>();

            //services.AddTransient<IGiftVoucherRepository, GiftVoucherRepository>();
            //services.AddTransient<IGiftVoucherService, GiftVoucherService>();

            //services.AddTransient<ITerminalsRepository, TerminalsRepository>();
            //services.AddTransient<ITerminalsService, TerminalsService>();

            //services.AddTransient<ITerminalGroupsRepository, TerminalGroupsRepository>();
            //services.AddTransient<ITerminalGroupsService, TerminalGroupService>();

            //services.AddTransient<ITerminalGroupItemRepository, TerminalGroupItemRepository>();
            //services.AddTransient<ITerminalGroupItemService, TerminalGroupItemService>();

            //services.AddTransient<INextNumberRepository, NextNumberRepository>();
            //services.AddTransient<INextNumberService, NextNumberService>();

            //services.AddTransient<ITenderTypesRepository, TenderTypesRepository>();
            //services.AddTransient<ITenderTypesService, TenderTypesService>();

            //services.AddTransient<IRequestForQuotationRepository, RequestForQuotationRepository>();
            //services.AddTransient<IRequestForQuotationService, RequestForQuotationService>();

            //services.AddTransient<IUtilitiesService, UtilitiesService>();
            //services.AddTransient<IUtilitiesRepository, UtilitiesRepository>();

            services.AddTransient<IReportDocumentTemplateService, ReportDocumentTemplateService>();
            services.AddTransient<IReportDocumentTemplateRepository, ReportDocumentTemplateRepository>();

            services.AddTransient<IReportEmailService, ReportEmailService>();
            services.AddTransient<IReportEmailRepository, ReportEmailRepository>();

            services.AddTransient<IReportScheduleRepository, ReportScheduleRepository>();
            services.AddTransient<IReportScheduleService, ReportScheduleService>();

            //services.AddTransient<ICreditReasonsRepository, CreditReasonsRepository>();
            //services.AddTransient<ICreditReasonsService, CreditReasonsService>();

            //services.AddTransient<IPriceWorkflowRepository, PriceWorkflowRepository>();
            //services.AddTransient<IPriceWorkflowService, PriceWorkflowService>();

            //services.AddTransient<ILandedCostImportCostRepository, LandedCostImportCostRepository>();
            //services.AddTransient<ILandedCostImportCostService, LandedCostImportCostService>();

            //services.AddTransient<IDocumentsService, DocumentsService>();
            //services.AddTransient<IDocumentsRepository, DocumentsRepository>();

            //services.AddTransient<IGoodsReceivedNoteService, GoodsReceivedNoteService>();
            //services.AddTransient<IGoodsReceivedNoteRepository, GoodsReceivedNoteRepository>();

            //services.AddTransient<IPurchaseInvoiceDetailRepository, PurchaseInvoiceDetailRepository>();
            //services.AddTransient<IPurchaseInvoiceDetailService, PurchaseInvoiceDetailService>();

            //services.AddTransient<IQuotationMainRepository, QuotationMainRepository>();
            //services.AddTransient<IQuotationMainService, QuotationMainService>();

            //services.AddTransient<IQuotationDetailRepository, QuotationDetailRepository>();
            //services.AddTransient<IQuotationDetailService, QuotationDetailService>();

            //services.AddTransient<IQuotationDetailTaxLabelsRepository, QuotationDetailTaxLabelsRepository>();
            //services.AddTransient<IQuotationDetailTaxLabelsService, QuotationDetailTaxLabelsService>();

            //services.AddTransient<IOrderMainRepository, OrderMainRepository>();
            //services.AddTransient<IOrderMainService, OrderMainService>();

            //services.AddTransient<IOrderDetailRepository, OrderDetailRepository>();
            //services.AddTransient<IOrderDetailService, OrderDetailService>();

            //services.AddTransient<IOrderDetailProductStyleMatrixRepository, OrderDetailProductStyleMatrixRepository>();
            //services.AddTransient<IOrderDetailProductStyleMatrixService, OrderDetailProductStyleMatrixService>();

            //services.AddTransient<IOrderDetailPriceGroupRepository, OrderDetailPriceGroupRepository>();
            //services.AddTransient<IOrderDetailPriceGroupService, OrderDetailPriceGroupService>();

            //services.AddTransient<IOrderDetailKitRepository, OrderDetailKitRepository>();
            //services.AddTransient<IOrderDetailKitService, OrderDetailKitService>();

            //services.AddTransient<IOrderDetailTaxLabelRepository, OrderDetailTaxLabelRepository>();
            //services.AddTransient<IOrderDetailTaxLabelService, OrderDetailTaxLabelService>();


            //services.AddTransient<IShiftRepositary, ShiftRepositary>();
            //services.AddTransient<IShiftServices,ShiftServices>();

            //services.AddTransient<DAL.POS.Interfaces.ICommonRepository, DAL.POS.CommonRepository>();
            //services.AddTransient<BLL.POS.Interfaces.ICommonService, BLL.POS.CommonService>();

            //services.AddTransient<IInternalTransfersDetailRepository, InternalTransfersDetailRepository>();
            //services.AddTransient<IInternalTransfersDetailService, InternalTransfersDetailService>();

            //services.AddTransient<IPrescriptionDoctorRepository, PrescriptionDoctorRepository>();
            //services.AddTransient<IPrescriptionDoctorService, PrescriptionDoctorService>();

            //services.AddTransient<IPrescriptionInstructionsRepository, PrescriptionInstructionsRepository>();
            //services.AddTransient<IPrescriptionInstructionsService, PrescriptionInstructionsService>();

            //services.AddTransient<IPatientMaintenanceRepository, PatientMaintenanceRepository>();
            //services.AddTransient<IPatientMaintenanceService, PatientMaintenanceService>();

            //services.AddTransient<IPrescriptionInstructionsRepository, PrescriptionInstructionsRepository>();
            //services.AddTransient<IPrescriptionInstructionsService, PrescriptionInstructionsService>();

            //services.AddTransient<INonPrescriptionLabelsRepository, NonPrescriptionLabelsRepository>();
            //services.AddTransient<INonPrescriptionLabelsService, NonPrescriptionLabelsService>();

            //services.AddTransient<IPrescriptionMaintenanceRepository, PrescriptionMaintenanceRepository>();
            //services.AddTransient<IPrescriptionMaintenanceService, PrescriptionMaintenanceService>();

            //services.AddTransient<IServerRelationShipRepository, ServerRelationShipRepository>();
            //services.AddTransient<IServerRelationShipService, ServerRelationShipService>();

            //services.AddTransient<IDeborReceiptRepository, DeborReceiptRepository>();
            //services.AddTransient<IDeborReceiptServices, DeborReceiptServices>();

            //services.AddTransient<ITransactionHistoryRepository, TransactionHistoryRepository>();
            //services.AddTransient<ITransactionHistoryService, TransactionHistoryService>();

            //services.AddTransient<ITransferRepository, TransferRepository>();
            //services.AddTransient<ITransferService, TransferService>();

            //services.AddTransient<IDebtorRefundRepository, DeborRefundRepository>();
            //services.AddTransient<IDebtorRefundServices, DebtorRefundServices>();

            //services.AddTransient<ITableRepositroy, TableRepository>();
            //services.AddTransient<ITableService, TableService>();

            //services.AddTransient<IReservationRepository, ReservationRepository>();
            //services.AddTransient<IReservationService, ReservationService>();


            //services.AddTransient<IDebtorAdjustmentRepository, DebtorAdjustmentRepository>();
            //services.AddTransient<IDebtorAdjustmentServices, DebtorAdjustmentServices>();

            //services.AddTransient<IKitchenProcessingViewRepository, KitchenProcessingViewRepository>();
            //services.AddTransient<IKitchenProcessingViewService, KitchenProcessingViewService>();

            //services.AddTransient<IInventoryPriceChangeAuditRepository, InventoryPriceChangeAuditRepository>();
            //services.AddTransient<IInventoryPriceChangeAuditService, InventoryPriceChangeAuditService>();
        }


        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            // Preceding code ommitted.
            app.UseCors("LinkEPR");

            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseAuthentication();
            // Following code ommited.
            app.UseMvc();

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.Options.StartupTimeout = new TimeSpan(days: 0, hours: 0, minutes: 1, seconds: 30);
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
