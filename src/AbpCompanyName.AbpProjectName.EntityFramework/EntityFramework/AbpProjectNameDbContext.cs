﻿using System.Data.Common;
using System.Data.Entity;
using Abp.Zero.EntityFramework;
using Microsoft.Extensions.Configuration;
using AbpCompanyName.AbpProjectName.Authorization.Roles;
using AbpCompanyName.AbpProjectName.Configuration;
using AbpCompanyName.AbpProjectName.MultiTenancy;
using AbpCompanyName.AbpProjectName.Users;
using AbpCompanyName.AbpProjectName.Web;

namespace AbpCompanyName.AbpProjectName.EntityFramework
{
    [DbConfigurationType(typeof(AbpProjectNameDbConfiguration))]
    public class AbpProjectNameDbContext : AbpZeroDbContext<Tenant, Role, User>
    {
        /* Define an IDbSet for each entity of the application */

        /* Default constructor is needed for EF command line tool. */
        public AbpProjectNameDbContext()
            : base(GetConnectionString())
        {

        }

        private static string GetConnectionString()
        {
            var configuration = AppConfigurations.Get(
                WebContentDirectoryFinder.CalculateContentRootFolder()
                );

            return configuration.GetConnectionString(
                AbpProjectNameConsts.ConnectionStringName
                );
        }

        /* This constructor is used by ABP to pass connection string.
         * Notice that, actually you will not directly create an instance of AbpProjectNameDbContext since ABP automatically handles it.
         */
        public AbpProjectNameDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {

        }

        /* This constructor is used in tests to pass a fake/mock connection. */
        public AbpProjectNameDbContext(DbConnection dbConnection)
            : base(dbConnection, true)
        {

        }
    }

    public class AbpProjectNameDbConfiguration : DbConfiguration
    {
        public AbpProjectNameDbConfiguration()
        {
            SetProviderServices(
                "System.Data.SqlClient",
                System.Data.Entity.SqlServer.SqlProviderServices.Instance
            );
        }
    }
}
