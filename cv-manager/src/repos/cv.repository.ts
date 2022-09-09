import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CV, Prisma } from '@prisma/client';

@Injectable()
export class CVRepository {
  constructor(private prisma: PrismaService) {}

  async cv(
    postWhereUniqueInput: Prisma.CVWhereUniqueInput,
  ): Promise<CV | null> {
    return this.prisma.cV.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async cvs(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CVWhereUniqueInput;
    where?: Prisma.CVWhereInput;
    orderBy?: Prisma.CVOrderByWithRelationInput;
  }): Promise<CV[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.cV.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createCV(data: Prisma.CVCreateInput): Promise<CV> {
    return this.prisma.cV.create({
      data,
    });
  }

  async updateCV(params: {
    where: Prisma.CVWhereUniqueInput;
    data: Prisma.CVUpdateInput;
  }): Promise<CV> {
    const { data, where } = params;
    return this.prisma.cV.update({
      data,
      where,
    });
  }

  async deleteCV(where: Prisma.CVWhereUniqueInput): Promise<CV> {
    return this.prisma.cV.delete({
      where,
    });
  }
}
